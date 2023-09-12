import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQlPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';
import { OfferRequestModule } from '../offer-request/offer-request.module';
import { SorterModule } from '../sorter/sorter.module';
import { SubscriptionManagerModule } from '../subscription-manager/subscription-manager.module';
import { UserModule } from '../user/user.module';

import { OFFER_SORTERS } from './offer.sorters';
import { OfferSubscription } from './offer.subscription';
import { OfferHubSpotModule } from './offer-hub-spot/offer-hub-spot.module';
import { BuyerOfferResolver } from './resolvers/buyer-offer.resolver';
import { OfferResolver } from './resolvers/offer.resolver';
import { OfferInitialDataFieldResolver } from './resolvers/offer-initial-data-field.resolver';
import { SellerOfferResolver } from './resolvers/seller-offer.resolver';
import { BuyerOfferService } from './services/buyer-offer.service';
import { OfferService } from './services/offer.service';
import { SellerOfferService } from './services/seller-offer.service';

@Module({
  imports: [
    FirebaseModule,
    GraphQlPubsubModule,
    UserModule,
    OfferHubSpotModule,
    SorterModule.create(OFFER_SORTERS),
    SubscriptionManagerModule.forFeature({
      imports: [FirebaseModule, OfferModule],
      subscriptions: [OfferSubscription],
    }),
    OfferRequestModule,
  ],
  providers: [
    BuyerOfferService,
    SellerOfferService,
    OfferService,
    BuyerOfferResolver,
    SellerOfferResolver,
    OfferResolver,
    OfferInitialDataFieldResolver,
  ],
  exports: [BuyerOfferService, SellerOfferService, OfferService],
})
export class OfferModule {}
