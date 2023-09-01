import { Module } from '@nestjs/common';

import { SellerResolver } from './seller.resolver';
import { SellerService } from './seller.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQLContextManagerModule } from '../graphql-context-manager/graphql-context-manager.module';
import { SellerContext } from './seller.context';
import { GraphQLPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';
import { SubscriptionManagerModule } from '../subscription-manager/subscription-manager.module';
import { SellerProfileSubscription } from './seller.subscription';

@Module({
  imports: [
    FirebaseModule,
    GraphQLPubsubModule,
    GraphQLContextManagerModule.forFeature({
      imports: [SellerModule],
      contexts: [SellerContext],
    }),
    SubscriptionManagerModule.forFeature({
      imports: [GraphQLPubsubModule, FirebaseModule],
      subscriptions: [SellerProfileSubscription],
    }),
  ],
  providers: [SellerResolver, SellerService],
  exports: [SellerService],
})
export class SellerModule {}
