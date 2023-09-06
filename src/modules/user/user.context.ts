import DataLoader from 'dataloader';
import { Injectable } from '@nestjs/common';

import { AppGraphQLContext } from 'src/app.types';

import { GraphQLContextProviderService } from '../graphql-context-manager/graphql-context-manager.interface';
import { UserService } from './user.service';

@Injectable()
export class UserContext implements GraphQLContextProviderService {
  constructor(private readonly userService: UserService) {}

  async createContext(): Promise<Partial<AppGraphQLContext>> {
    return {
      userLoader: new DataLoader((ids) => this.userService.getUserByIds(ids)),
    };
  }
}
