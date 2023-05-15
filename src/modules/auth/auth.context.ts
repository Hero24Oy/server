import { Injectable } from '@nestjs/common';

import { GraphQLBaseContext, AppGraphQLContext } from 'src/app.types';

import { GraphQLContextProviderService } from '../graphql-context-manager/graphql-context-manager.interface';
import { AuthService } from './auth.service';

@Injectable()
export class AuthContext implements GraphQLContextProviderService {
  constructor(private authService: AuthService) {}

  async createContext(
    ctx: GraphQLBaseContext,
  ): Promise<Partial<AppGraphQLContext>> {
    const identity = await this.authService.authorizeUser(ctx);

    return { identity };
  }
}
