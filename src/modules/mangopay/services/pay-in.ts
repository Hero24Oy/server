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
// import { MakeDirectCardPayInInput } from '../graphql';
import { MangopaySearchParameters, PayInParameters } from '../types';

import { MangopayInstanceService } from './instance';

import { BuyerService } from '$modules/buyer/buyer.service';
import { TransactionService } from '$modules/transaction';
import { TransactionSubjectService } from '$modules/transaction-subject';

@Injectable()
export class MangopayPayInService {
  constructor(
    private readonly api: MangopayInstanceService,
    private readonly transactionService: TransactionService,
    private readonly transactionSubjectService: TransactionSubjectService,
    private readonly buyerService: BuyerService,
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
      SecureModeReturnURL: parameters.redirectUrl,
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

  // We need to confirm mangopay flow and then get author and wallet ids
  // async makePayIn(input: MakeDirectCardPayInInput): Promise<boolean> {
  //   const { ip, browserInfo, transactionId, cardId, redirectUrl } = input;

  //   const transaction = await this.transactionService.getTransactionById(
  //     transactionId,
  //   );

  //   if (!transaction) {
  //     throw new Error('Invalid transaction id');
  //   }

  //   const { amount, subjectId, subjectType } = transaction;

  //   const customerId =
  //     await this.transactionSubjectService.getCustomerIdBySubject({
  //       subjectId,
  //       subjectType,
  //     });

  //   if (!customerId) {
  //     throw new Error('Transaction owner not found');
  //   }

  //   const customer = await this.buyerService.strictGetBuyerProfileById(
  //     customerId,
  //   );

  //   await this.createDirectCardPayIn({
  //     fee: 0,
  //     ip,
  //     browserInfo,
  //     amount,
  //     cardId,
  //     redirectUrl,
  //   });

  //   return true;
  // }
}
