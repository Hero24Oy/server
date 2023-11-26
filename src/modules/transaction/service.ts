import { Injectable } from '@nestjs/common';
import { PaymentTransaction } from 'hero24-types';

import { FirebaseDatabasePath } from '$modules/firebase/firebase.constants';
import { FirebaseService } from '$modules/firebase/firebase.service';
import { FirebaseTableReference } from '$modules/firebase/firebase.types';

@Injectable()
export class TransactionService {
  readonly transactionTableRef: FirebaseTableReference<PaymentTransaction>;

  constructor(firebaseService: FirebaseService) {
    const database = firebaseService.getDefaultApp().database();

    this.transactionTableRef = database.ref(
      FirebaseDatabasePath.PAYMENT_TRANSACTIONS,
    );
  }

  async getTransactionById(id: string): Promise<PaymentTransaction | null> {
    const transactionsSnapshot = await this.transactionTableRef.child(id).get();

    return transactionsSnapshot.val();
  }

  async getStrictTransactionById(id: string): Promise<PaymentTransaction> {
    const transactionsSnapshot = await this.transactionTableRef.child(id).get();

    const transaction = transactionsSnapshot.val();

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return transaction;
  }
}
