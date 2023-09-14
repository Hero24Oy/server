import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';

import { GraphQlContextProviderService } from '../graphql-context-manager/graphql-context-manager.interface';

import { BuyerService } from './buyer.service';

import { AppGraphQlContext } from '$/app.types';

@Injectable()
export class BuyerContext implements GraphQlContextProviderService {
  constructor(private buyerService: BuyerService) {}

  async createContext(): Promise<Partial<AppGraphQlContext>> {
    return {
      buyerLoader: new DataLoader((ids) =>
        this.buyerService.getBuyerByIds(ids),
      ),
    };
  }
}
