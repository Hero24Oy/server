import { NestFactory } from '@nestjs/core';
import {
  OldPaymentTransaction,
  PaymentSystem,
  PaymentTransaction,
  PaymentTransactionStatus,
  PaymentTransactionSubjectType,
  PaymentTransactionType,
} from 'hero24-types';

import { AppModule } from '$/app.module';
import { FirebaseDatabasePath } from '$modules/firebase/firebase.constants';
import { FirebaseService } from '$modules/firebase/firebase.service';
import { FirebaseTableReference } from '$modules/firebase/firebase.types';
import { TransactionService } from '$modules/transaction';

const transformTransactionDataToNewApproach = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  const firebaseService = app.get<FirebaseService>(TransactionService);

  const database = firebaseService.getDefaultApp().database();

  const oldTransactionTableRef: FirebaseTableReference<OldPaymentTransaction> =
    database.ref(FirebaseDatabasePath.PAYMENT_TRANSACTIONS);

  const newTransactionTableRef: FirebaseTableReference<PaymentTransaction> =
    database.ref(FirebaseDatabasePath.PAYMENT_TRANSACTIONS);

  const transactions = (await oldTransactionTableRef.get()).val();

  if (!transactions) {
    return;
  }

  await Promise.all(
    Object.entries(transactions).map(async ([id, transaction]) => {
      let status: PaymentTransactionStatus;
      let service: PaymentSystem;
      let externalServiceId: string | number;
      let subjectType: PaymentTransactionSubjectType;
      let subjectId: string;

      if (transaction.status === 'paid') {
        status = PaymentTransactionStatus.PAID;
      } else if (transaction.status === 'pending') {
        status = PaymentTransactionStatus.PENDING;
      } else {
        status = PaymentTransactionStatus.CANCELLED;
      }

      if (transaction.stripePaymentIntentId) {
        service = PaymentSystem.STRIPE;
        externalServiceId = transaction.stripePaymentIntentId;
      } else if (transaction.netvisorReferenceNumber) {
        service = PaymentSystem.NETVISOR;
        externalServiceId = transaction.netvisorReferenceNumber;
      } else {
        service = PaymentSystem.NETVISOR;
        externalServiceId = 0;
      }

      if (transaction.fees) {
        subjectType = PaymentTransactionSubjectType.FEE;
        // eslint-disable-next-line prefer-destructuring -- we need only first key
        subjectId = Object.keys(transaction.fees)[0];
      } else if (transaction.duration && transaction.offerId) {
        subjectType = PaymentTransactionSubjectType.TASK;
        subjectId = transaction.offerId;
      } else {
        return newTransactionTableRef.child(id).remove();
      }

      const newTransaction: PaymentTransaction = {
        amount: transaction.totalAmount,
        createdAt: transaction.createdAt,
        paidAt: transaction.paidAt,
        promotionId: transaction.promotionId,
        type: PaymentTransactionType.PAY_IN,
        status,
        service,
        externalServiceId,
        subjectType,
        subjectId,
      };

      return newTransactionTableRef.child(id).set(newTransaction);
    }),
  );

  process.exit(0);
};

void transformTransactionDataToNewApproach();
