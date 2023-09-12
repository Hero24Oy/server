import { Injectable } from '@nestjs/common';

import { GraphQlContextProviderService } from '../graphql-context-manager/graphql-context-manager.interface';

import { AppGraphQlContext, GraphQlBaseContext } from '$/src/app.types';

@Injectable()
export class CommonContext implements GraphQlContextProviderService {
  async createContext({
    req,
    res,
    connectionParams,
  }: GraphQlBaseContext): Promise<Partial<AppGraphQlContext>> {
    return { req, res, connectionParams };
  }
}
