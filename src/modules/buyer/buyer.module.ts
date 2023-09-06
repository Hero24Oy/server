import { Module } from '@nestjs/common';

import { BuyerResolver } from './buyer.resolver';
import { BuyerService } from './buyer.service';
import { BuyerProfileSubscription } from './buyer.subscription';
import { BuyerContext } from './buyer.context';

import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQLContextManagerModule } from '../graphql-context-manager/graphql-context-manager.module';
import { GraphQLPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';
import { SubscriptionManagerModule } from '../subscription-manager/subscription-manager.module';

@Module({
  imports: [
    FirebaseModule,
    GraphQLPubsubModule,
    GraphQLContextManagerModule.forFeature({
      imports: [BuyerModule],
      contexts: [BuyerContext],
    }),
    SubscriptionManagerModule.forFeature({
      imports: [GraphQLPubsubModule, FirebaseModule],
      subscriptions: [BuyerProfileSubscription],
    }),
  ],
  providers: [BuyerResolver, BuyerService],
  exports: [BuyerService],
})
export class BuyerModule {}
