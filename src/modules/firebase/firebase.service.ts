import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { deleteApp, initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';

import * as stagingServiceAccount from '../../../firebase-service-account.stag.json';
import * as productionServiceAccount from '../../../firebase-service-account.prod.json';
import {
  FirebaseAdminAppInstance,
  FirebaseAppInstance,
} from './firebase.types';

@Injectable()
export class FirebaseService {
  private app: FirebaseAdminAppInstance;

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

  private getClientFirebaseConfig() {
    const isProd = this.configService.get('app.isProduction');

    const projectId = isProd
      ? 'hero24-production-ec006'
      : 'hero24-staging-d4086';

    return {
      apiKey: isProd
        ? 'AIzaSyCYkHFir5x11xCwa0uOOigbK30nsFtd4Wg'
        : 'AIzaSyDda-yoVzNETyuokPxSwwMezHLWvBQ3WHw',
      authDomain: `${projectId}.firebaseapp.com`,
      databaseURL: `https://${projectId}-default-rtdb.europe-west1.firebasedatabase.app`,
      projectId,
      storageBucket: `gs://${projectId}.appspot.com`,
      messagingSenderId: isProd ? '868348751692' : '797025663538',
      functionsUrl: `https://${projectId}.web.app`,
    };
  }

  getDefaultApp() {
    return this.app;
  }

  initClientApp(appName: string): FirebaseAppInstance {
    const firebaseConfig = this.getClientFirebaseConfig();

    return initializeApp(firebaseConfig, appName);
  }

  async authorizeUser(uid: string, app: FirebaseAppInstance) {
    const customToken = await this.app.auth().createCustomToken(uid);

    const auth = getAuth(app);

    await signInWithCustomToken(auth, customToken);
  }

  async destroyApp(app: FirebaseAppInstance) {
    try {
      await deleteApp(app);
    } catch (err) {
      console.error(err);
    }
  }
}
