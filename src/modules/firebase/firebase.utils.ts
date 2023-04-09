import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

import { FIREBASE_APP_IN_REQUEST_PATH } from './firebase.constants';
import { FirebaseAppInstance } from './firebase.types';

export const pickFirebaseAppFromRequest = (
  req: Request,
): FirebaseAppInstance | null => req[FIREBASE_APP_IN_REQUEST_PATH] || null;

export const pickRequestFromExecutionContext = (
  context: ExecutionContext,
): Request | null => {
  switch (context.getType<'http' | 'graphql'>()) {
    case 'http':
      return context.switchToHttp().getRequest();

    case 'graphql':
      const ctx = GqlExecutionContext.create(context);
      const gqlCtx = ctx.getContext();

      return gqlCtx.req;

    default:
      return null;
  }
};
