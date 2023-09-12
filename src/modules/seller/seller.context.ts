import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { AppGraphQlContext } from 'src/app.types';

import { GraphQlContextProviderService } from '../graphql-context-manager/graphql-context-manager.interface';

import { SellerService } from './seller.service';

@Injectable()
export class SellerContext implements GraphQlContextProviderService {
  constructor(private sellerService: SellerService) {}

  async createContext(): Promise<Partial<AppGraphQlContext>> {
    return {
      sellerLoader: new DataLoader((ids) =>
        this.sellerService.getSellerByIds(ids),
      ),
    };
  }
}
