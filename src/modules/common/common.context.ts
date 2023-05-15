import { Injectable } from '@nestjs/common';

import { AppGraphQLContext, GraphQLBaseContext } from 'src/app.types';

import { GraphQLContextProviderService } from '../graphql-context-manager/graphql-context-manager.interface';

@Injectable()
export class CommonContext implements GraphQLContextProviderService {
  async createContext({
    req,
    res,
    connectionParams,
  }: GraphQLBaseContext): Promise<Partial<AppGraphQLContext>> {
    return { req, res, connectionParams };
  }
}
