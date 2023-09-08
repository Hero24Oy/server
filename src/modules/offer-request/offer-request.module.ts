import { Module } from '@nestjs/common';
import { OfferRequestResolver } from './offer-request.resolver';
import { OfferRequestService } from './offer-request.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { SorterModule } from '../sorter/sorter.module';
import { OFFER_REQUEST_SORTERS } from './offer-request.sorters';
import { FiltererModule } from '../filterer/filterer.module';
import { OFFER_REQUEST_FILTERS } from './offer-request.filers';
import { GraphQLPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';
import { SubscriptionManagerModule } from '../subscription-manager/subscription-manager.module';
import { OfferRequestSubscription } from './offer-request.subscription';
import { OpenOfferRequestModule } from './open-offer-request/open-offer-request.module';

@Module({
  imports: [
    FirebaseModule,
    GraphQLPubsubModule,
    OpenOfferRequestModule,
    SubscriptionManagerModule.forFeature({
      imports: [OfferRequestModule],
      subscriptions: [OfferRequestSubscription],
    }),
    SorterModule.create(OFFER_REQUEST_SORTERS),
    FiltererModule.create(OFFER_REQUEST_FILTERS),
  ],
  providers: [OfferRequestResolver, OfferRequestService],
  exports: [OfferRequestService],
})
export class OfferRequestModule {}
