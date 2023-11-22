import { Injectable } from '@nestjs/common';
import MangopayApi, {
  transaction as MangopayTransaction,
} from 'mangopay2-nodejs-sdk';

import { MangopayTransactionType } from '../enums';

import { ConfigType } from '$config';
import { Config } from '$decorator';

@Injectable()
export class MangopayInstanceService extends MangopayApi {
  constructor(@Config() config: ConfigType) {
    super(config.mangopay);
  }

  filterTransactions(
    transactions: MangopayTransaction.TransactionData[],
    transactionType: MangopayTransactionType,
  ): MangopayTransaction.TransactionData[] {
    return transactions.filter(
      (transaction: MangopayTransaction.TransactionData) => {
        return transaction.Type === transactionType;
      },
    );
  }
}
