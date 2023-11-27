import { Injectable } from '@nestjs/common';
import { PaymentTransaction } from 'hero24-types';
import {
  payIn as MangopayPayIn,
  transaction as MangopayTransaction,
} from 'mangopay2-nodejs-sdk';

import {
  MangopayCurrency,
  MangopayPayInExecutionType,
  MangopayPayInPaymentType,
  MangopayTransactionType,
} from '../enums';
import {
  JwtTokenPayload,
  MangopaySearchParameters,
  PayInParameters,
} from '../types';

import { MangopayInstanceService } from './instance';

import { ConfigType } from '$config';
import { Config } from '$decorator';
import { JwtService } from '$modules/jwt';
import { TransactionService } from '$modules/transaction';

@Injectable()
export class MangopayPayInService {
  constructor(
    @Config() private readonly config: ConfigType,
    private readonly jwtService: JwtService,
    private readonly transactionService: TransactionService,
    private readonly api: MangopayInstanceService,
  ) {}

  async createDirectCardPayIn(
    parameters: PayInParameters,
  ): Promise<MangopayPayIn.CardDirectPayInData> {
    return this.api.PayIns.create({
      AuthorId: parameters.authorId,
      DebitedFunds: {
        Currency: MangopayCurrency.EUR,
        Amount: parameters.amount,
      },
      Fees: {
        Currency: MangopayCurrency.EUR,
        Amount: parameters.fee,
      },
      CreditedWalletId: parameters.walletId,
      CardId: parameters.cardId,
      SecureModeReturnURL: parameters.returnUrl,
      PaymentType: MangopayPayInPaymentType.CARD,
      ExecutionType: MangopayPayInExecutionType.DIRECT,
      IpAddress: parameters.ip,
      BrowserInfo: parameters.browserInfo,
    });
  }

  async getPayInById(id: string): Promise<MangopayPayIn.PayInData> {
    return this.api.PayIns.get(id);
  }

  async getAllPayInsByUserId(
    id: string,
    parameters?: MangopaySearchParameters,
  ): Promise<MangopayTransaction.TransactionData[]> {
    const transactions = await this.api.Users.getTransactions(id, {
      parameters,
    });

    return this.api.filterTransactions(
      transactions,
      MangopayTransactionType.PAYIN,
    );
  }

  async getAllPayInsByWalletId(
    id: string,
    parameters?: MangopaySearchParameters,
  ): Promise<MangopayTransaction.TransactionData[]> {
    const transactions = await this.api.Wallets.getTransactions(id, {
      parameters,
    });

    return this.api.filterTransactions(
      transactions,
      MangopayTransactionType.PAYIN,
    );
  }

  async generatePaymentTokenByTransactionId(
    transactionId: string,
  ): Promise<string> {
    const transaction = await this.transactionService.getTransactionById(
      transactionId,
    );

    if (!transaction) {
      throw new Error('Invalid transaction id');
    }

    return this.jwtService.sign({
      data: { transactionId },
      secret: this.config.mangopay.paymentLinkSecret,
      expiresIn: this.config.mangopay.linkExpirationTime,
    });
  }

  verifyPaymentToken(token: string): JwtTokenPayload {
    return this.jwtService.verify<JwtTokenPayload>({
      token,
      secret: this.config.mangopay.paymentLinkSecret,
    });
  }

  async getPayInDataByToken(token: string): Promise<PaymentTransaction> {
    let transactionId: string;

    try {
      const payload = this.verifyPaymentToken(token);

      transactionId = payload.transactionId;
    } catch {
      throw new Error('Payment token invalid');
    }

    return this.transactionService.getStrictTransactionById(transactionId);
  }
}
