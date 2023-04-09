import { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

import {
  pickFirebaseAppFromRequest,
  pickRequestFromExecutionContext,
} from './firebase.utils';

export const FirebaseApp = createParamDecorator(
  (_data: string, ctx: ExecutionContext) => {
    const request = pickRequestFromExecutionContext(ctx);

    return request && pickFirebaseAppFromRequest(request);
  },
);
