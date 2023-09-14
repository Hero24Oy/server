import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, tap } from 'rxjs';
import { AppGraphQlContext } from 'src/app.types';

import { FirebaseService } from './firebase.service';

@Injectable()
export class FirebaseInterceptor implements NestInterceptor {
  private logger = new Logger(FirebaseInterceptor.name);

  constructor(private firebaseService: FirebaseService) {}

  async intercept(
    executionContext: ExecutionContext,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- we need any here
    next: CallHandler<any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- we need any here
  ): Promise<Observable<any>> {
    try {
      const graphQlExecutionContext =
        GqlExecutionContext.create(executionContext);

      const context = graphQlExecutionContext.getContext<AppGraphQlContext>();

      const { identity } = context;

      const app = await this.firebaseService.initializeApp(identity?.id);

      context.app = app;

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
