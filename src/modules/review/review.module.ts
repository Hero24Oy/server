import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQlPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';
import { SellerModule } from '../seller/seller.module';
import { SubscriptionManagerModule } from '../subscription-manager/subscription-manager.module';

import { ReviewResolver } from './review.resolver';
import { ReviewService } from './review.service';
import { ReviewSubscription } from './review.subscription';

@Module({
  imports: [
    FirebaseModule,
    GraphQlPubsubModule,
    SellerModule,
    SubscriptionManagerModule.forFeature({
      imports: [GraphQlPubsubModule, FirebaseModule],
      subscriptions: [ReviewSubscription],
    }),
  ],
  providers: [ReviewResolver, ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
