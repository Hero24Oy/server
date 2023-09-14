import { forwardRef, Module } from '@nestjs/common';

import { OfferRequestModule } from '../offer-request.module';

import { OpenOfferRequestResolver } from './open-offer-request.resolver';
import { OpenOfferRequestService } from './open-offer-request.service';
import { OpenOfferRequestSubscription } from './open-offer-request.subscription';

import { FirebaseModule } from '$modules/firebase/firebase.module';
import { GraphQlPubsubModule } from '$modules/graphql-pubsub/graphql-pubsub.module';
import { SubscriptionManagerModule } from '$modules/subscription-manager/subscription-manager.module';

@Module({
  imports: [
    forwardRef(() => OfferRequestModule),
    FirebaseModule,
    GraphQlPubsubModule,
    SubscriptionManagerModule.forFeature({
      imports: [OpenOfferRequestModule],
      subscriptions: [OpenOfferRequestSubscription],
    }),
  ],
  providers: [OpenOfferRequestService, OpenOfferRequestResolver],
  exports: [OpenOfferRequestService],
})
export class OpenOfferRequestModule {}
