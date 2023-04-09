import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { deleteApp } from 'firebase/app';
import { tap } from 'rxjs';
import { Observable } from 'rxjs';

import {
  FIREBASE_APP_IN_REQUEST_PATH,
  FIREBASE_USER_IN_REQUEST_PATH,
} from './firebase.constants';
import { pickRequestFromExecutionContext } from './firebase.utils';
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

      const app = await this.firebaseService.initClientApp(user.uid);

      req[FIREBASE_APP_IN_REQUEST_PATH] = app;
      req[FIREBASE_USER_IN_REQUEST_PATH] = user;

      const destroyApp = () =>
        deleteApp(app).catch((err) => console.error(err));

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
