import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQlPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';
import { SellerModule } from '../seller/seller.module';
import { SubscriptionManagerModule } from '../subscription-manager/subscription-manager.module';

import { ReviewMirror } from './mirror';
import { ReviewResolver } from './resolver';
import { ReviewService } from './service';
import { ReviewSubscription } from './subscription';

@Module({
  imports: [
    FirebaseModule,
    GraphQlPubsubModule,
    GraphQlPubsubModule,
    SellerModule,
    SubscriptionManagerModule.forFeature({
      imports: [FirebaseModule, GraphQlPubsubModule, ReviewModule],
      subscriptions: [ReviewMirror],
    }),
  ],
  providers: [ReviewSubscription, ReviewResolver, ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
