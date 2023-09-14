import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { AppGraphQlContext } from '$/app.types';
import { GuardBoolean } from '$modules/common/common.types';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): GuardBoolean {
    const graphQlExecutionContext = GqlExecutionContext.create(context);

    const { identity } =
      graphQlExecutionContext.getContext<AppGraphQlContext>();

    return Boolean(identity);
  }
}
