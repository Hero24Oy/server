import { Injectable } from '@nestjs/common';
import { GraphQLContextProviderService } from './graphql-context-manager.interface';
import { AppGraphQLContext, GraphQLBaseContext } from 'src/app.types';

@Injectable()
export class GraphQLContextManagerService {
  private contextProviders: GraphQLContextProviderService[];

  constructor(...contextProviders: GraphQLContextProviderService[]) {
    this.contextProviders = contextProviders;
  }

  async createContext(ctx: GraphQLBaseContext): Promise<AppGraphQLContext> {
    return this.contextProviders.reduce(
      async (contextualPromise, contextProvider) => ({
        ...(await contextualPromise),
        ...(await contextProvider.createContext(ctx)),
      }),
      Promise.resolve({}),
    ) as Promise<AppGraphQLContext>;
  }
}
