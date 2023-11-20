import { Injectable } from '@nestjs/common';
import {
  payOut as MangopayPayOut,
  transaction as MangopayTransaction,
} from 'mangopay2-nodejs-sdk';

import {
  MangopayCurrency,
  MangopayPayoutPaymentType,
  MangopayTransactionType,
} from '../enums';
import { MangopaySearchParameters, PayOutParameters } from '../types';

import { MangopayInstanceService } from './instance';

@Injectable()
export class MangopayPayOutService {
  constructor(private readonly api: MangopayInstanceService) {}

  async createPayOut(
    parameters: PayOutParameters,
  ): Promise<MangopayPayOut.PayOutData> {
    return this.api.PayOuts.create({
      AuthorId: parameters.authorId,
      DebitedFunds: {
        Currency: MangopayCurrency.EUR,
        Amount: parameters.amount,
      },
      Fees: {
        Currency: MangopayCurrency.EUR,
        Amount: parameters.fee,
      },
      BankAccountId: parameters.bankId,
      DebitedWalletId: parameters.walletId,
      PaymentType: MangopayPayoutPaymentType.BANK_WIRE,
    });
  }

  async getPayOutById(id: string): Promise<MangopayPayOut.PayOutData> {
    return this.api.PayOuts.get(id);
  }

  async getAllPayOutsByUserId(
    id: string,
    parameters?: MangopaySearchParameters,
  ): Promise<MangopayTransaction.TransactionData[]> {
    const transactions = await this.api.Users.getTransactions(id, {
      parameters,
    });

    return transactions.filter((transaction) => {
      return transaction.Type === MangopayTransactionType.PAYOUT;
    });
  }

  async getAllPayOutsByWalletId(
    id: string,
    parameters?: MangopaySearchParameters,
  ): Promise<MangopayTransaction.TransactionData[]> {
    const transactions = await this.api.Wallets.getTransactions(id, {
      parameters,
    });

    return transactions.filter((transaction) => {
      return transaction.Type === MangopayTransactionType.PAYOUT;
    });
  }

  async getAllPayOutsByBankId(
    id: string,
    parameters?: MangopaySearchParameters,
  ): Promise<MangopayTransaction.TransactionData[]> {
    return this.api.BankAccounts.getTransactions(id, {
      parameters,
    });
  }
}
