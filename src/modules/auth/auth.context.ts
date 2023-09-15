import { Injectable } from '@nestjs/common';

import { GraphQlContextProviderService } from '../graphql-context-manager/graphql-context-manager.interface';

import { AuthService } from './auth.service';

import { AppGraphQlContext, GraphQlBaseContext } from '$/app.types';

@Injectable()
export class AuthContext implements GraphQlContextProviderService {
  constructor(private authService: AuthService) {}

  async createContext(
    ctx: GraphQlBaseContext,
  ): Promise<Partial<AppGraphQlContext>> {
    const identity = await this.authService.authorizeUser(ctx);

    return { identity };
  }
}
