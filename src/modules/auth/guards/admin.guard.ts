import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { AppGraphQLContext } from 'src/app.types';
import { GuardBoolean } from 'src/modules/common/common.types';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(executionContext: ExecutionContext): GuardBoolean {
    const graphQLExecutionContext =
      GqlExecutionContext.create(executionContext);

    const context = graphQLExecutionContext.getContext<AppGraphQLContext>();
    const { identity } = context;

    return Boolean(identity?.isAdmin);
  }
}
