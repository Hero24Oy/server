import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { OfferService } from './offer.service';
import { OfferRequestModule } from '../offer-request/offer-request.module';
import { OfferHubSpotModule } from './offer-hub-spot/offer-hub-spot.module';
import { SubscriptionManagerModule } from '../subscription-manager/subscription-manager.module';
import { OfferHubSpotSubscription } from './offer-hub-spot/offer-hub-spot.subscription';
import { OfferSubscription } from './offer.subscription';
import { GraphQLPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';
import { OFFER_SORTERS } from './offer.sorters';
import { SorterModule } from '../sorter/sorter.module';
import { UserModule } from '../user/user.module';
import { BuyerOfferResolver } from './resolvers/buyer-offer.resolver';
import { SellerOfferResolver } from './resolvers/seller-offer.resolver';
import { CommonOfferResolver } from './resolvers/common-offer.resolver';

@Module({
  imports: [
    FirebaseModule,
    GraphQLPubsubModule,
    UserModule,
    SorterModule.create(OFFER_SORTERS),
    SubscriptionManagerModule.forFeature({
      imports: [FirebaseModule, OfferHubSpotModule, OfferModule],
      subscriptions: [OfferHubSpotSubscription, OfferSubscription],
    }),
    OfferRequestModule,
  ],
  providers: [
    OfferService,
    BuyerOfferResolver,
    SellerOfferResolver,
    CommonOfferResolver,
  ],
  exports: [OfferService],
})
export class OfferModule {}
