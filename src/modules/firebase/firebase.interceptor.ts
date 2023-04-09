import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs';
import { Observable } from 'rxjs';

import { FIREBASE_APP_IN_REQUEST_PATH } from './firebase.constants';
import { pickRequestFromExecutionContext } from './firebase.utils';
import { FirebaseService } from './firebase.service';

@Injectable()
export class FirebaseInterceptor implements NestInterceptor {
  private logger = new Logger(FirebaseInterceptor.name);

  constructor(private firebaseService: FirebaseService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    try {
      const req = pickRequestFromExecutionContext(context);

      if (!req) {
        return next.handle();
      }

      const token = req.headers.authorization || '';
      const decodedIdToken = await this.firebaseService.verifyIdToken(token);
      const app = await this.firebaseService.initializeApp(decodedIdToken);

      req[FIREBASE_APP_IN_REQUEST_PATH] = app;

      const destroyApp = () => this.firebaseService.destroyApp(app);

      return next.handle().pipe(
        tap({
          next: destroyApp,
          error: destroyApp,
        }),
      );
    } catch (err) {
      this.logger.error(err);

      return next.handle();
    }
  }
}
