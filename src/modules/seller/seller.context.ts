import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';

import { GraphQlContextProviderService } from '../graphql-context-manager/graphql-context-manager.interface';

import { SellerService } from './seller.service';

import { AppGraphQlContext } from '$/app.types';

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
