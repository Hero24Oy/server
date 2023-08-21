import DataLoader from 'dataloader';
import { Injectable } from '@nestjs/common';

import { AppGraphQLContext } from 'src/app.types';

import { GraphQLContextProviderService } from '../graphql-context-manager/graphql-context-manager.interface';
import { SellerService } from './seller.service';

@Injectable()
export class SellerContext implements GraphQLContextProviderService {
  constructor(private sellerService: SellerService) {}

  async createContext(): Promise<Partial<AppGraphQLContext>> {
    return {
      sellerLoader: new DataLoader((ids) =>
        this.sellerService.getSellerByIds(ids),
      ),
    };
  }
}
