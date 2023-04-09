import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { deleteApp, initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';

import {
  FirebaseAdminAppInstance,
  FirebaseAppInstance,
} from './firebase.types';

@Injectable()
export class FirebaseService {
  private app: FirebaseAdminAppInstance;

  constructor(private configService: ConfigService) {
    this.app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: configService.getOrThrow<string>(
          'firebase.serviceAccount.projectId',
        ),
        clientEmail: configService.getOrThrow<string>(
          'firebase.serviceAccount.clientEmail',
        ),
        privateKey: configService.getOrThrow<string>(
          'firebase.serviceAccount.privateKey',
        ),
      }),
      databaseURL: configService.getOrThrow<string>('firebase.databaseURL'),
    });
  }

  private getClientFirebaseConfig() {
    return {
      apiKey: this.configService.getOrThrow<string>(
        'firebase.clientSdk.apiKey',
      ),
      authDomain: this.configService.getOrThrow<string>(
        'firebase.clientSdk.authDomain',
      ),
      databaseURL: this.configService.getOrThrow<string>(
        'firebase.clientSdk.databaseURL',
      ),
      projectId: this.configService.getOrThrow<string>(
        'firebase.clientSdk.projectId',
      ),
      storageBucket: this.configService.getOrThrow<string>(
        'firebase.clientSdk.storageBucket',
      ),
      messagingSenderId: this.configService.getOrThrow<string>(
        'firebase.clientSdk.messagingSenderId',
      ),
      functionsUrl: this.configService.getOrThrow<string>(
        'firebase.clientSdk.functionsUrl',
      ),
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
