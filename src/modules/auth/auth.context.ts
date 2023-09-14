import { Injectable } from '@nestjs/common';
import { AppGraphQlContext, GraphQlBaseContext } from 'src/app.types';

import { GraphQlContextProviderService } from '../graphql-context-manager/graphql-context-manager.interface';

import { AuthService } from './auth.service';

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
