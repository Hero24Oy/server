import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';

import { FirebaseService } from './firebase.service';
import { AppGraphQLContext } from 'src/app.types';

@Injectable()
export class FirebaseInterceptor implements NestInterceptor {
  private logger = new Logger(FirebaseInterceptor.name);

  constructor(private firebaseService: FirebaseService) {}

  async intercept(
    executionContext: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    try {
      const graphQLExecutionContext =
        GqlExecutionContext.create(executionContext);
      const context = graphQLExecutionContext.getContext<AppGraphQLContext>();

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
