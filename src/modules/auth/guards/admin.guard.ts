import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { Scope } from '../auth.constants';

import { AppGraphQlContext } from '$/src/app.types';
import { GuardBoolean } from '$modules/common/common.types';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(executionContext: ExecutionContext): GuardBoolean {
    const graphQlExecutionContext =
      GqlExecutionContext.create(executionContext);

    const context = graphQlExecutionContext.getContext<AppGraphQlContext>();
    const { identity } = context;

    return identity?.scope === Scope.ADMIN;
  }
}
