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

import { CorruptedTransaction } from './types';
import { isNewTransaction } from './utils';
import { newTransactionSchema } from './validation';

import { AppModule } from '$/app.module';
import { FirebaseDatabasePath } from '$modules/firebase/firebase.constants';
import { FirebaseService } from '$modules/firebase/firebase.service';
import { FirebaseTableReference } from '$modules/firebase/firebase.types';
import { OfferService } from '$modules/offer/services/offer.service';
import { OfferRequestService } from '$modules/offer-request/offer-request.service';
import { TransactionService } from '$modules/transaction';

const corruptedTransactions: CorruptedTransaction[] = [];

const transformTransactionDataToNewApproach = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  const firebaseService = app.get<FirebaseService>(TransactionService);
  const offerRequestService = app.get<OfferRequestService>(OfferRequestService);
  const offerService = app.get<OfferService>(OfferService);

  const database = firebaseService.getDefaultApp().database();

  const transactionTableRef: FirebaseTableReference<
    OldPaymentTransaction | PaymentTransaction
  > = database.ref(FirebaseDatabasePath.PAYMENT_TRANSACTIONS);

  const transactionsSnapshot = await transactionTableRef.get();
  const transactions = transactionsSnapshot.val();

  if (!transactions) {
    return;
  }

  const newTransactions = await Promise.all(
    Object.entries(transactions).map(async ([id, transaction]) => {
      // if the migration is interrupted
      if (isNewTransaction(transaction)) {
        return;
      }

      const {
        createdAt,
        paidAt,
        promotionId,
        totalAmount,
        offerRequestId,
        stripePaymentIntentId,
        netvisorReferenceNumber,
        fees,
        offerId,
        duration,
        pricePerHour,
      } = transaction;

      const offerRequest = await offerRequestService.getOfferRequestById(
        offerRequestId,
      );

      if (!offerRequest) {
        corruptedTransactions.push({
          id,
          reason: 'Invalid offer request',
        });

        return;
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

      if (prePayWith === PaymentSystem.STRIPE && stripePaymentIntentId) {
        service = PaymentSystem.STRIPE;
        externalServiceId = stripePaymentIntentId;
      } else if (
        prePayWith === PaymentSystem.NETVISOR &&
        netvisorReferenceNumber
      ) {
        service = PaymentSystem.NETVISOR;
        externalServiceId = netvisorReferenceNumber;
      } else {
        service = PaymentSystem.NETVISOR;
        externalServiceId = null;
      }

      if (fees) {
        subjectType = PaymentTransactionSubjectType.FEE;
        // eslint-disable-next-line prefer-destructuring -- we need only first key
        subjectId = Object.keys(fees)[0];
      } else if (duration && offerId) {
        // extension time
        const offer = await offerService.getOfferById(offerId);

        const extensionFromTransaction = offer?.data.extensions?.find(
          (extension) => {
            return (
              extension.duration === duration &&
              extension.pricePerHour === pricePerHour
            );
          },
        );

        if (!extensionFromTransaction) {
          corruptedTransactions.push({
            id,
            reason: 'Transaction does not have a reference to extension',
          });

          return;
        }

        subjectType = PaymentTransactionSubjectType.TIME;
        subjectId = `${offerId}//${extensionFromTransaction.id}`;
      } else {
        // task
        subjectType = PaymentTransactionSubjectType.TASK;
        subjectId = offerRequestId;
      }

      const newTransaction: PaymentTransaction = {
        amount: totalAmount,
        createdAt,
        paidAt,
        promotionId,
        type: PaymentTransactionType.PAY_IN,
        status,
        service,
        externalServiceId,
        subjectType,
        subjectId,
      };

      return [id, newTransaction] as [string, PaymentTransaction];
    }),
  );

  await Promise.all(
    newTransactions.map(async (transactionData) => {
      if (!transactionData) {
        return;
      }

      const [id, transaction] = transactionData;

      try {
        await newTransactionSchema.validate(transaction);
      } catch {
        corruptedTransactions.push({
          id,
          reason: "Transaction after transform doesn't pass validation",
        });
      }
    }),
  );

  if (corruptedTransactions.length > 0) {
    console.error('Corrupted transactions detected');
    console.error(corruptedTransactions);
  } else {
    await Promise.all(
      newTransactions.map(async (transactionData) => {
        if (!transactionData) {
          return;
        }

        const [id, transaction] = transactionData;

        return transactionTableRef.child(id).set(transaction);
      }),
    );
  }

  process.exit(0);
};

void transformTransactionDataToNewApproach();
