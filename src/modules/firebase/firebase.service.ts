import * as admin from 'firebase-admin';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { deleteApp, initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';

import {
  FirebaseAdminAppInstance,
  FirebaseAppInstance,
} from './firebase.types';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { FirebaseAppService } from './firebase.app.service';

@Injectable()
export class FirebaseService {
  private app: FirebaseAdminAppInstance;
  private logger = new Logger(FirebaseService.name);

  constructor(
    private configService: ConfigService,
    private firebaseAppService: FirebaseAppService,
  ) {
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

  async authorizeUser(uid: string, app: FirebaseAppInstance) {
    const customToken = await this.app.auth().createCustomToken(uid);

    const auth = getAuth(app);

    await signInWithCustomToken(auth, customToken);
  }

  async destroyApp(app: FirebaseAppInstance) {
    const appName = app.name;

    try {
      const leftConnectionCount =
        this.firebaseAppService.removeAppConnection(appName);

      if (leftConnectionCount === 0) {
        await this.firebaseAppService.lockDeleting(appName, async (resolve) => {
          await deleteApp(app);
          resolve();
        });
      }
    } catch (err) {
      this.logger.error(err);
    }
  }

  async verifyIdToken(token: string): Promise<DecodedIdToken | null> {
    try {
      const decodedToken = await this.app
        .auth()
        .verifyIdToken(token.replace('Bearer ', ''));

      return decodedToken;
    } catch (err) {
      return null;
    }
  }

  async initializeApp(
    decodedIdToken: DecodedIdToken | null,
  ): Promise<FirebaseAppInstance> {
    const appName = decodedIdToken?.uid || uuidv4();

    this.firebaseAppService.addAppConnection(appName);

    if (this.firebaseAppService.isDeleting(appName)) {
      await this.firebaseAppService.waitDeleting(appName);
    }

    const apps = getApps();
    const existedApp = apps.find(({ name }) => appName === name);

    let app: FirebaseAppInstance;

    if (existedApp) {
      app = existedApp;
    } else {
      const firebaseConfig = this.getClientFirebaseConfig();

      app = initializeApp(firebaseConfig, appName);
    }

    if (!decodedIdToken) {
      return app;
    }

    const { uid } = decodedIdToken;

    if (!this.firebaseAppService.isAuthorized(appName)) {
      this.firebaseAppService.lockAuthorizing(appName, async (resolve) => {
        try {
          await this.authorizeUser(uid, app);
        } catch (err) {}

        resolve(app);
      });
    }

    return this.firebaseAppService.waitAuthorizing(
      appName,
    ) as Promise<FirebaseAppInstance>;
  }
}
