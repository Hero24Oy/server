import DataLoader from 'dataloader';
import { Injectable } from '@nestjs/common';

import { AppGraphQLContext } from 'src/app.types';

import { GraphQLContextProviderService } from '../graphql-context-manager/graphql-context-manager.interface';
import { BuyerService } from './buyer.service';

@Injectable()
export class BuyerContext implements GraphQLContextProviderService {
  constructor(private buyerService: BuyerService) {}

  async createContext(): Promise<Partial<AppGraphQLContext>> {
    return {
      buyerLoader: new DataLoader((ids) =>
        this.buyerService.getBuyerByIds(ids),
      ),
    };
  }
}
