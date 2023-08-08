import { Module } from '@nestjs/common';
import { BuyerResolver } from './buyer.resolver';
import { BuyerService } from './buyer.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQLContextManagerModule } from '../graphql-context-manager/graphql-context-manager.module';
import { BuyerContext } from './buyer.conext';

@Module({
  imports: [
    FirebaseModule,
    GraphQLContextManagerModule.forFeature({
      imports: [BuyerModule],
      contexts: [BuyerContext],
    }),
  ],
  providers: [BuyerResolver, BuyerService],
  exports: [BuyerService],
})
export class BuyerModule {}
