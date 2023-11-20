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
import { MangopaySearchParameters, PayInParameters } from '../types';

import { MangopayInstanceService } from './instance';

@Injectable()
export class MangopayPayInService {
  constructor(private readonly api: MangopayInstanceService) {}

  async createDirectCardPayIn(
    params: PayInParameters,
  ): Promise<MangopayPayIn.CardDirectPayInData> {
    return this.api.PayIns.create({
      AuthorId: params.author,
      DebitedFunds: {
        Currency: MangopayCurrency.EUR,
        Amount: params.amount,
      },
      Fees: {
        Currency: MangopayCurrency.EUR,
        Amount: params.fee,
      },
      CreditedWalletId: params.walletId,
      CardId: params.cardId,
      SecureModeReturnURL: params.returnUrl,
      PaymentType: MangopayPayInPaymentType.CARD,
      ExecutionType: MangopayPayInExecutionType.DIRECT,
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
}
