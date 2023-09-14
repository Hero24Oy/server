import { Injectable } from '@nestjs/common';
import { AppGraphQlContext, GraphQlBaseContext } from 'src/app.types';

import { GraphQlContextProviderService } from './graphql-context-manager.interface';

@Injectable()
export class GraphQlContextManagerService {
  private contextProviders: GraphQlContextProviderService[];

  constructor(...contextProviders: GraphQlContextProviderService[]) {
    this.contextProviders = contextProviders;
  }

  async createContext(ctx: GraphQlBaseContext): Promise<AppGraphQlContext> {
    return this.contextProviders.reduce(
      async (contextualPromise, contextProvider) => ({
        ...(await contextualPromise),
        ...(await contextProvider?.createContext(ctx)),
      }),
      Promise.resolve({}),
    ) as Promise<AppGraphQlContext>;
  }
}
