import { Injectable } from '@nestjs/common';
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
import { MakeDirectCardPayInInput } from '../graphql';
import { MangopaySearchParameters, PayInParameters } from '../types';

import { MangopayInstanceService } from './instance';

import { TransactionService } from '$modules/transaction';
import { TransactionSubjectService } from '$modules/transaction-subject';

@Injectable()
export class MangopayPayInService {
  constructor(
    private readonly api: MangopayInstanceService,
    private readonly transactionService: TransactionService,
    private readonly transactionSubjectService: TransactionSubjectService,
  ) {}

  async createDirectCardPayIn(
    parameters: PayInParameters,
  ): Promise<MangopayPayIn.CardDirectPayInData> {
    const { browserInfo } = parameters;

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
      SecureModeReturnURL: parameters.redirectUrl,
      PaymentType: MangopayPayInPaymentType.CARD,
      ExecutionType: MangopayPayInExecutionType.DIRECT,
      IpAddress: parameters.ip,
      BrowserInfo: {
        AcceptHeader: browserInfo.acceptHeader,
        ColorDepth: browserInfo.colorDepth,
        JavaEnabled: browserInfo.javaEnabled,
        JavascriptEnabled: browserInfo.javascriptEnabled,
        Language: browserInfo.language,
        ScreenHeight: browserInfo.screenHeight,
        ScreenWidth: browserInfo.screenWidth,
        TimeZoneOffset: browserInfo.timeZoneOffset,
        UserAgent: browserInfo.userAgent,
      },
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

  async makePayIn(input: MakeDirectCardPayInInput): Promise<boolean> {
    const { ip, browserInfo, transactionId, cardId, redirectUrl } = input;

    const transaction = await this.transactionService.getTransactionById(
      transactionId,
    );

    if (!transaction) {
      throw new Error('Invalid transaction id');
    }

    const { amount, subjectId, subjectType } = transaction;

    const customer =
      await this.transactionSubjectService.strictGetCustomerBySubject({
        subjectId,
        subjectType,
      });

    if (!customer.mangopay) {
      throw new Error('Customer does not have mangopay account');
    }

    const { id, walletId } = customer.mangopay;

    await this.createDirectCardPayIn({
      fee: 0,
      ip,
      browserInfo,
      amount,
      cardId,
      redirectUrl,
      authorId: id,
      walletId,
    });

    return true;
  }
}
