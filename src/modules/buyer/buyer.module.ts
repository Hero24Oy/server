import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQlContextManagerModule } from '../graphql-context-manager/graphql-context-manager.module';

import { BuyerContext } from './buyer.context';
import { BuyerResolver } from './buyer.resolver';
import { BuyerService } from './buyer.service';

@Module({
  imports: [
    FirebaseModule,
    GraphQlContextManagerModule.forFeature({
      imports: [BuyerModule],
      contexts: [BuyerContext],
    }),
  ],
  providers: [BuyerResolver, BuyerService],
  exports: [BuyerService],
})
export class BuyerModule {}
