import { Module } from '@nestjs/common';
import { OfferRequestResolver } from './resolvers/offer-request.resolver';
import { OfferRequestService } from './offer-request.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { SorterModule } from '../sorter/sorter.module';
import { OFFER_REQUEST_SORTERS } from './offer-request.sorters';
import { FiltererModule } from '../filterer/filterer.module';
import { OFFER_REQUEST_FILTERS } from './offer-request.filers';
import { GraphQLPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';
import { SubscriptionManagerModule } from '../subscription-manager/subscription-manager.module';
import { OfferRequestSubscription } from './offer-request.subscription';
import { OfferRequestSellerResolver } from './resolvers/offer-request-seller.resolver';

@Module({
  imports: [
    FirebaseModule,
    GraphQLPubsubModule,
    SubscriptionManagerModule.forFeature({
      imports: [OfferRequestModule],
      subscriptions: [OfferRequestSubscription],
    }),
    SorterModule.create(OFFER_REQUEST_SORTERS),
    FiltererModule.create(OFFER_REQUEST_FILTERS),
  ],
  providers: [
    OfferRequestResolver,
    OfferRequestSellerResolver,
    OfferRequestService,
  ],
  exports: [OfferRequestService],
})
export class OfferRequestModule {}
