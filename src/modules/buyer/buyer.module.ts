import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQlContextManagerModule } from '../graphql-context-manager/graphql-context-manager.module';
import { GraphQlPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';
import { SubscriptionManagerModule } from '../subscription-manager/subscription-manager.module';

import { BuyerContext } from './buyer.context';
import { BuyerResolver } from './buyer.resolver';
import { BuyerService } from './buyer.service';
import { BuyerProfileSubscription } from './buyer.subscription';

@Module({
  imports: [
    FirebaseModule,
    GraphQlPubsubModule,
    GraphQlContextManagerModule.forFeature({
      imports: [BuyerModule],
      contexts: [BuyerContext],
    }),
    SubscriptionManagerModule.forFeature({
      imports: [GraphQlPubsubModule, FirebaseModule],
      subscriptions: [BuyerProfileSubscription],
    }),
  ],
  providers: [BuyerResolver, BuyerService],
  exports: [BuyerService],
})
export class BuyerModule {}
