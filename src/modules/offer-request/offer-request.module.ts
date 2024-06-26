import { Module } from '@nestjs/common';

import { FiltererModule } from '../filterer/filterer.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQlPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';
import { SorterModule } from '../sorter/sorter.module';
import { SubscriptionManagerModule } from '../subscription-manager/subscription-manager.module';

import { OFFER_REQUEST_FILTERS } from './offer-request.filers';
import { OfferRequestMirror } from './offer-request.mirror';
import { OfferRequestResolver } from './offer-request.resolver';
import { OfferRequestService } from './offer-request.service';
import { OFFER_REQUEST_SORTERS } from './offer-request.sorters';
import { OfferRequestSubscription } from './offer-request.subscription';
import { OpenOfferRequestModule } from './open-offer-request/open-offer-request.module';

@Module({
  imports: [
    FirebaseModule,
    GraphQlPubsubModule,
    OpenOfferRequestModule,
    SubscriptionManagerModule.forFeature({
      imports: [FirebaseModule, OfferRequestModule],
      subscriptions: [OfferRequestSubscription, OfferRequestMirror],
    }),
    SorterModule.create(OFFER_REQUEST_SORTERS),
    FiltererModule.create(OFFER_REQUEST_FILTERS),
  ],
  providers: [OfferRequestResolver, OfferRequestService],
  exports: [OfferRequestService],
})
export class OfferRequestModule {}
