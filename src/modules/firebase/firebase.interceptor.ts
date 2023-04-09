import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { tap } from 'rxjs';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

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

      const appName = uuidv4();
      const app = this.firebaseService.initClientApp(appName);
      const destroyApp = () => this.firebaseService.destroyApp(app);

      req[FIREBASE_APP_IN_REQUEST_PATH] = app;

      const token = req.headers.authorization;

      if (!token) {
        return next.handle().pipe(
          tap({
            next: destroyApp,
            error: destroyApp,
          }),
        );
      }

      try {
        const defaultApp = this.firebaseService.getDefaultApp();

        const { uid } = await defaultApp
          .auth()
          .verifyIdToken(token.replace('Bearer ', ''));

        const user = await defaultApp.auth().getUser(uid);

        await this.firebaseService.authorizeUser(uid, app);

        req[FIREBASE_USER_IN_REQUEST_PATH] = user;
      } catch (err) {}

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
