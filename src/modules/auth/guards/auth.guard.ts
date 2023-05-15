import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { AppGraphQLContext } from 'src/app.types';
import { GuardBoolean } from 'src/modules/common/common.types';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): GuardBoolean {
    const graphQLExecutionContext = GqlExecutionContext.create(context);

    const { identity } =
      graphQLExecutionContext.getContext<AppGraphQLContext>();

    return Boolean(identity);
  }
}
