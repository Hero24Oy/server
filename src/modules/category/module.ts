import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQlPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';
import { OfferRequestModule } from '../offer-request/offer-request.module';
import { SubscriptionManagerModule } from '../subscription-manager/subscription-manager.module';

import { CategoryResolver } from './resolver';
import { CategoryService } from './service';
import { CategorySubscription } from './subscription';

@Module({
  imports: [
    FirebaseModule,
    OfferRequestModule,
    GraphQlPubsubModule,
    SubscriptionManagerModule.forFeature({
      imports: [FirebaseModule, GraphQlPubsubModule, CategoryModule],
      subscriptions: [CategorySubscription],
    }),
  ],
  providers: [CategoryService, CategoryResolver],
  exports: [CategoryService],
})
export class CategoryModule {}
