import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { tap } from 'rxjs';
import { Observable } from 'rxjs';

import {
  FIREBASE_APP_IN_REQUEST_PATH,
  FIREBASE_USER_IN_REQUEST_PATH,
} from './firebase.constants';
import { pickRequestFromExecutionContext } from './firebase.utils';
import { FirebaseAppInstance } from './firebase.types';
import { FirebaseService } from './firebase.service';

@Injectable()
export class FirebaseInterceptor implements NestInterceptor {
  constructor(
    private configService: ConfigService,
    private firebaseService: FirebaseService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    try {
      const req = pickRequestFromExecutionContext(context);

      if (!req) {
        return next.handle();
      }

      const token = req.headers.authorization;

      if (!token) {
        return next.handle();
      }

      const defaultApp = this.firebaseService.getDefaultApp();

      const { uid } = await defaultApp
        .auth()
        .verifyIdToken(token.replace('Bearer ', ''));

      const user = await defaultApp.auth().getUser(uid);

      let app: FirebaseAppInstance;

      const candidate = admin.apps.find((item) => item?.name === uid);

      if (candidate) {
        app = candidate;
      } else {
        const firebaseServiceAccount = this.firebaseService.getServiceAccount();

        app = admin.initializeApp(
          {
            credential: admin.credential.cert({
              projectId: firebaseServiceAccount.project_id,
              clientEmail: firebaseServiceAccount.client_email,
              privateKey: firebaseServiceAccount.private_key,
            }),
            databaseURL: this.configService.get<string>('firebase.databaseURL'),
            databaseAuthVariableOverride: {
              uid,
            },
          },
          uid,
        );
      }

      req[FIREBASE_APP_IN_REQUEST_PATH] = app;
      req[FIREBASE_USER_IN_REQUEST_PATH] = user;

      const destroyApp = () => () =>
        app.delete().catch((err) => console.error(err));

      return next.handle().pipe(
        tap({
          next: destroyApp,
          error: destroyApp,
        }),
      );
    } catch (err) {
      console.error(err);

      return next.handle();
    }
  }
}
