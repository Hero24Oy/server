import { Injectable, Logger } from '@nestjs/common';
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
  FirebaseConfig,
  FirebaseTable,
} from './firebase.types';

import { ConfigType } from '$config';
import { Config } from '$decorator';

@Injectable()
export class FirebaseService {
  private readonly app: FirebaseAdminAppInstance;

  private readonly storage: FirebaseAdminStorage;

  private readonly logger = new Logger(FirebaseService.name);

  constructor(
    @Config()
    private readonly config: ConfigType,
    private readonly firebaseAppService: FirebaseAppService,
  ) {
    this.app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: this.config.firebase.serviceAccount.projectId,
        clientEmail: this.config.firebase.serviceAccount.clientEmail,
        privateKey: this.config.firebase.serviceAccount.privateKey,
      }),
      databaseURL: this.config.firebase.databaseURL,
      storageBucket: `${this.config.firebase.serviceAccount.projectId}.appspot.com`,
    });

    this.storage = this.app.storage();
  }

  private getClientFirebaseConfig(): FirebaseConfig {
    return this.config.firebase.clientSdk;
  }

  getDefaultApp(): FirebaseAdminAppInstance {
    return this.app;
  }

  getStorage(): FirebaseAdminStorage {
    return this.storage;
  }

  async authorizeUser(uid: string, app: FirebaseAppInstance): Promise<void> {
    const customToken = await this.app.auth().createCustomToken(uid);

    const auth = getAuth(app);

    await signInWithCustomToken(auth, customToken);
  }

  async destroyApp(app: FirebaseAppInstance): Promise<void> {
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

  async getIsAdmin(userId: string): Promise<boolean> {
    const isAdminSnapshot = await this.app
      .database()
      .ref<FirebaseTable<boolean>>(FirebaseDatabasePath.ADMIN_USERS)
      .child(userId)
      .get();

    return Boolean(isAdminSnapshot.val());
  }
}
