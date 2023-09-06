import { Module } from '@nestjs/common';

import { ReviewResolver } from './review.resolver';
import { ReviewService } from './review.service';
import { ReviewSubscription } from './review.subscription';

import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQLPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';
import { SubscriptionManagerModule } from '../subscription-manager/subscription-manager.module';
import { SellerModule } from '../seller/seller.module';

@Module({
  imports: [
    FirebaseModule,
    GraphQLPubsubModule,
    SellerModule,
    SubscriptionManagerModule.forFeature({
      imports: [GraphQLPubsubModule, FirebaseModule],
      subscriptions: [ReviewSubscription],
    }),
  ],
  providers: [ReviewResolver, ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
