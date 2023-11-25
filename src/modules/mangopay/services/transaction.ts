import { Injectable } from '@nestjs/common';
import {
  transaction as MangopayTransaction,
  transfer as MangopayTransfer,
} from 'mangopay2-nodejs-sdk';

import { MangopayCurrency, MangopayTransactionType } from '../enums';
import { MangopaySearchParameters, TransactionParameters } from '../types';

import { MangopayInstanceService } from './instance';

@Injectable()
export class MangopayTransactionService {
  constructor(private readonly api: MangopayInstanceService) {}

  async createTransaction(
    parameters: TransactionParameters,
  ): Promise<MangopayTransfer.TransferData> {
    return this.api.Transfers.create({
      AuthorId: parameters.authorId,
      DebitedFunds: {
        Currency: MangopayCurrency.EUR,
        Amount: parameters.amount,
      },
      Fees: {
        Currency: MangopayCurrency.EUR,
        Amount: parameters.fee,
      },
      DebitedWalletId: parameters.transfer.from,
      CreditedWalletId: parameters.transfer.to,
    });
  }

  async getTransactionById(id: string): Promise<MangopayTransfer.TransferData> {
    return this.api.Transfers.get(id);
  }

  async getAllTransactionByUserId(
    id: string,
    parameters?: MangopaySearchParameters,
  ): Promise<MangopayTransaction.TransactionData[]> {
    const transactions = await this.api.Users.getTransactions(id, {
      parameters,
    });

    return this.api.filterTransactions(
      transactions,
      MangopayTransactionType.TRANSFER,
    );
  }

  async getAllTransactionByWalletId(
    id: string,
    parameters?: MangopaySearchParameters,
  ): Promise<MangopayTransaction.TransactionData[]> {
    const transactions = await this.api.Wallets.getTransactions(id, {
      parameters,
    });

    return this.api.filterTransactions(
      transactions,
      MangopayTransactionType.TRANSFER,
    );
  }
}
