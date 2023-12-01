import { NestFactory } from '@nestjs/core';
import { OfferRequestDB, PaymentTransaction } from 'hero24-types';

import { AppModule } from '$/app.module';
import { FirebaseDatabasePath } from '$modules/firebase/firebase.constants';
import { FirebaseService } from '$modules/firebase/firebase.service';
import { FirebaseTableReference } from '$modules/firebase/firebase.types';

const dropOldTransactions = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  const firebaseService = app.get<FirebaseService>(FirebaseService);

  const database = firebaseService.getDefaultApp().database();

  const transactionTableRef: FirebaseTableReference<PaymentTransaction> =
    database.ref(FirebaseDatabasePath.PAYMENT_TRANSACTIONS);

  const offerRequestTableRef: FirebaseTableReference<OfferRequestDB> =
    database.ref(FirebaseDatabasePath.OFFER_REQUESTS);

  const offerRequestsSnapshot = await offerRequestTableRef.get();

  const offerRequests = offerRequestsSnapshot.val();

  if (!offerRequests) {
    throw new Error('Failed to get offer requests');
  }

  await Promise.all(
    Object.keys(offerRequests).map((id) => {
      return offerRequestTableRef
        .child(id)
        .child('paymentTransactions')
        .set({});
    }),
  );

  await transactionTableRef.set({});

  process.exit(0);
};

void dropOldTransactions();
