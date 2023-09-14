import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { AppGraphQlContext } from '$/app.types';

export const FirebaseApp = createParamDecorator(
  (_data: string, context: ExecutionContext) => {
    const graphQlExecutionContext = GqlExecutionContext.create(context);

    const { app } = graphQlExecutionContext.getContext<AppGraphQlContext>();

    return app;
  },
);
