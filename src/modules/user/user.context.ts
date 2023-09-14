import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';

import { GraphQlContextProviderService } from '../graphql-context-manager/graphql-context-manager.interface';

import { UserService } from './user.service';

import { AppGraphQlContext } from '$/src/app.types';

@Injectable()
export class UserContext implements GraphQlContextProviderService {
  constructor(private userService: UserService) {}

  async createContext(): Promise<Partial<AppGraphQlContext>> {
    return {
      userLoader: new DataLoader((ids) => this.userService.getUserByIds(ids)),
    };
  }
}
