import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { OfferService } from './offer.service';
import { OfferResolver } from './offer.resolver';
import { OfferRequestModule } from '../offer-request/offer-request.module';
import { OfferHubSpotModule } from './offer-hub-spot/offer-hub-spot.module';
import { SubscriptionManagerModule } from '../subscription-manager/subscription-manager.module';
import { OfferHubSpotSubscription } from './offer-hub-spot/offer-hub-spot.subscription';
import { OfferSubscription } from './offer.subscription';
import { GraphQLPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';

@Module({
  imports: [
    FirebaseModule,
    GraphQLPubsubModule,
    SubscriptionManagerModule.forFeature({
      imports: [FirebaseModule, OfferHubSpotModule, OfferModule],
      subscriptions: [OfferHubSpotSubscription, OfferSubscription],
    }),
    OfferRequestModule,
  ],
  providers: [OfferService, OfferResolver],
  exports: [OfferService],
})
export class OfferModule {}
