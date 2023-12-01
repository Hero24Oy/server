import { Injectable } from '@nestjs/common';
import { PaymentTransaction } from 'hero24-types';

import { TransactionObject } from './graphql';

import { FirebaseDatabasePath } from '$modules/firebase/firebase.constants';
import { FirebaseService } from '$modules/firebase/firebase.service';
import { FirebaseTableReference } from '$modules/firebase/firebase.types';
import { OfferRequestService } from '$modules/offer-request/offer-request.service';

@Injectable()
export class TransactionService {
  readonly transactionTableRef: FirebaseTableReference<PaymentTransaction>;

  constructor(
    private readonly taskRequestService: OfferRequestService,
    firebaseService: FirebaseService,
  ) {
    const database = firebaseService.getDefaultApp().database();

    this.transactionTableRef = database.ref(
      FirebaseDatabasePath.PAYMENT_TRANSACTIONS,
    );
  }

  async getTransactionsByTaskRequestId(
    taskRequestId: string,
  ): Promise<TransactionObject[]> {
    const taskRequest = await this.taskRequestService.getOfferRequestById(
      taskRequestId,
    );

    if (!taskRequest) {
      throw new Error('Task request not found');
    }

    const transactionIds = taskRequest.paymentTransactions ?? [];

    const transactions = await Promise.all(
      transactionIds.map((id) => {
        return this.strictGetTransactionById(id);
      }),
    );

    return transactions;
  }

  async getTransactionById(id: string): Promise<PaymentTransaction | null> {
    const transactionsSnapshot = await this.transactionTableRef.child(id).get();

    return transactionsSnapshot.val();
  }

  async strictGetTransactionById(id: string): Promise<TransactionObject> {
    const transaction = await this.getTransactionById(id);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return TransactionObject.adapter.toExternal(transaction);
  }
}
