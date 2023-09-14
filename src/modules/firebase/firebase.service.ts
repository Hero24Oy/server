import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { deleteApp, getApps, initializeApp } from 'firebase/app';
import { AuthError, getAuth, signInWithCustomToken } from 'firebase/auth';
import * as admin from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { v4 as uuidv4 } from 'uuid';

import { callRepeatedlyAsync } from '../common/common.utils';

import { FirebaseAppService } from './firebase.app.service';
import { FirebaseDatabasePath, MAX_TRYING_COUNT } from './firebase.constants';
import {
  FirebaseAdminAppInstance,
  FirebaseAdminStorage,
  FirebaseAppInstance,
} from './firebase.types';

@Injectable()
export class FirebaseService {
  private app: FirebaseAdminAppInstance;

  private storage: FirebaseAdminStorage;

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
      storageBucket: `${configService.getOrThrow<string>(
        'firebase.serviceAccount.projectId',
      )}.appspot.com`,
    });

    this.storage = this.app.storage();
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

  getStorage() {
    return this.storage;
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

  async initializeApp(userId?: string): Promise<FirebaseAppInstance> {
    const appName = userId || uuidv4();

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

    if (!userId) {
      this.logger.debug("UserId isn't provided");

      return app;
    }

    if (!this.firebaseAppService.isAuthorized(appName)) {
      this.firebaseAppService.lockAuthorizing(appName, async (resolve) => {
        try {
          await callRepeatedlyAsync(
            () => this.authorizeUser(userId, app),
            (error: AuthError) => error.code === 'auth/internal-error',
            MAX_TRYING_COUNT,
          );
        } catch (err) {
          const error = err as Error;

          this.logger.debug(
            `Authorization is failed, userId is "${userId}" with message ${error.message}`,
          );
        }

        resolve(app);
      });
    }

    return this.firebaseAppService.waitAuthorizing(
      appName,
    ) as Promise<FirebaseAppInstance>;
  }

  async getIsAdmin(userId: string) {
    const isAdminSnapshot = await this.app
      .database()
      .ref(FirebaseDatabasePath.ADMIN_USERS)
      .child(userId)
      .once('value');

    return Boolean(isAdminSnapshot.val());
  }
}
