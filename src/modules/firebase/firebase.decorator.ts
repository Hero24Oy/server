import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { AppGraphQLContext } from 'src/app.types';

export const FirebaseApp = createParamDecorator(
  (_data: string, context: ExecutionContext) => {
    const graphQLExecutionContext = GqlExecutionContext.create(context);

    const { app } = graphQLExecutionContext.getContext<AppGraphQLContext>();

    return app;
  },
);
