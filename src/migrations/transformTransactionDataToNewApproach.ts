import { NestFactory } from '@nestjs/core';
import {
  OldPaymentTransaction,
  PaidStatus,
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
import { OfferService } from '$modules/offer/services/offer.service';
import { OfferRequestService } from '$modules/offer-request/offer-request.service';
import { TransactionService } from '$modules/transaction';

const transformTransactionDataToNewApproach = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  const firebaseService = app.get<FirebaseService>(TransactionService);
  const offerRequestService = app.get<OfferRequestService>(OfferRequestService);
  const offerService = app.get<OfferService>(OfferService);

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
      const offerRequest = await offerRequestService.getOfferRequestById(
        transaction.offerRequestId,
      );

      if (!offerRequest) {
        // corrupted transaction, all transactions must have offer request
        return newTransactionTableRef.child(id).remove();
      }

      let status: PaymentTransactionStatus;
      let service: PaymentSystem;
      let externalServiceId: string | number | null;
      let subjectType: PaymentTransactionSubjectType;
      let subjectId: string;

      const { prepaid, prePayWith } = offerRequest.data.initial;

      // Paid status can be only paid or waiting
      if (prepaid === PaidStatus.PAID) {
        status = PaymentTransactionStatus.PAID;
      } else {
        status = PaymentTransactionStatus.PENDING;
      }

      if (
        prePayWith === PaymentSystem.STRIPE &&
        transaction.stripePaymentIntentId
      ) {
        service = PaymentSystem.STRIPE;
        externalServiceId = transaction.stripePaymentIntentId;
      } else if (
        prePayWith === PaymentSystem.NETVISOR &&
        transaction.netvisorReferenceNumber
      ) {
        service = PaymentSystem.NETVISOR;
        externalServiceId = transaction.netvisorReferenceNumber;
      } else {
        service = PaymentSystem.NETVISOR;
        externalServiceId = null;
      }

      if (transaction.fees) {
        subjectType = PaymentTransactionSubjectType.FEE;
        // eslint-disable-next-line prefer-destructuring -- we need only first key
        subjectId = Object.keys(transaction.fees)[0];
      } else if (transaction.duration && transaction.offerId) {
        // extension time
        const offer = await offerService.getOfferById(transaction.offerId);

        const extensionFromTransaction = offer?.data.extensions?.find(
          (extension) => {
            return (
              extension.duration === transaction.duration &&
              extension.pricePerHour === transaction.pricePerHour
            );
          },
        );

        if (!extensionFromTransaction) {
          // corrupted transaction, transaction doesn't have reference to extension
          return newTransactionTableRef.child(id).remove();
        }

        subjectType = PaymentTransactionSubjectType.TIME;
        subjectId = `${transaction.offerId}//${extensionFromTransaction.id}`;
      } else {
        // task
        subjectType = PaymentTransactionSubjectType.TASK;
        subjectId = transaction.offerRequestId;
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
