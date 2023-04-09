import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as stagingServiceAccount from '../../../firebase-service-account.stag.json';
import * as productionServiceAccount from '../../../firebase-service-account.prod.json';
import { FirebaseAppInstance } from './firebase.types';

@Injectable()
export class FirebaseService {
  private app: FirebaseAppInstance;

  constructor(private configService: ConfigService) {
    const firebaseServiceAccount = this.getServiceAccount();

    this.app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: firebaseServiceAccount.project_id,
        clientEmail: firebaseServiceAccount.client_email,
        privateKey: firebaseServiceAccount.private_key,
      }),
      databaseURL: configService.get<string>('firebase.databaseURL'),
    });
  }

  getServiceAccount() {
    return this.configService.get('app.isDevelopment')
      ? stagingServiceAccount
      : productionServiceAccount;
  }

  getDefaultApp() {
    return this.app;
  }
}
