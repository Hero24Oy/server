import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { OfferRequestModule } from '../offer-request/offer-request.module';
import { SubscriptionManagerModule } from '../subscription-manager/subscription-manager.module';
import { OfferSubscription } from './offer.subscription';
import { GraphQLPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';
import { OFFER_SORTERS } from './offer.sorters';
import { SorterModule } from '../sorter/sorter.module';
import { UserModule } from '../user/user.module';
import { BuyerOfferResolver } from './resolvers/buyer-offer.resolver';
import { SellerOfferResolver } from './resolvers/seller-offer.resolver';
import { OfferResolver } from './resolvers/offer.resolver';
import { BuyerOfferService } from './services/buyer-offer.service';
import { SellerOfferService } from './services/seller-offer.service';
import { OfferService } from './services/offer.service';
import { OfferHubSpotModule } from './offer-hub-spot/offer-hub-spot.module';

@Module({
  imports: [
    FirebaseModule,
    GraphQLPubsubModule,
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
  ],
  exports: [BuyerOfferService, SellerOfferService, OfferService],
})
export class OfferModule {}
