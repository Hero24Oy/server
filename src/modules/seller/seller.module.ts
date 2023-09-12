import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQlContextManagerModule } from '../graphql-context-manager/graphql-context-manager.module';
import { GraphQlPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';
import { SubscriptionManagerModule } from '../subscription-manager/subscription-manager.module';

import { SellerContext } from './seller.context';
import { SellerResolver } from './seller.resolver';
import { SellerService } from './seller.service';
import { SellerProfileSubscription } from './seller.subscription';

@Module({
  imports: [
    FirebaseModule,
    GraphQlPubsubModule,
    GraphQlContextManagerModule.forFeature({
      imports: [SellerModule],
      contexts: [SellerContext],
    }),
    SubscriptionManagerModule.forFeature({
      imports: [GraphQlPubsubModule, FirebaseModule],
      subscriptions: [SellerProfileSubscription],
    }),
  ],
  providers: [SellerResolver, SellerService],
  exports: [SellerService],
})
export class SellerModule {}
