import { NestFactory } from '@nestjs/core';
import { PaymentTransaction } from 'hero24-types';

import { AppModule } from '$/app.module';
import { FirebaseDatabasePath } from '$modules/firebase/firebase.constants';
import { FirebaseService } from '$modules/firebase/firebase.service';
import { FirebaseTableReference } from '$modules/firebase/firebase.types';
import { TransactionService } from '$modules/transaction';

const dropOldTransactions = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  const firebaseService = app.get<FirebaseService>(TransactionService);

  const database = firebaseService.getDefaultApp().database();

  const transactionTableRef: FirebaseTableReference<PaymentTransaction> =
    database.ref(FirebaseDatabasePath.PAYMENT_TRANSACTIONS);

  await transactionTableRef.set({});

  process.exit(0);
};

void dropOldTransactions();
