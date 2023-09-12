import { forwardRef, Module } from '@nestjs/common';
import { FirebaseModule } from 'src/modules/firebase/firebase.module';
import { GraphQlPubsubModule } from 'src/modules/graphql-pubsub/graphql-pubsub.module';
import { SubscriptionManagerModule } from 'src/modules/subscription-manager/subscription-manager.module';

// eslint-disable-next-line import/no-cycle
import { OfferRequestModule } from '../offer-request.module';

import { OpenOfferRequestResolver } from './open-offer-request.resolver';
import { OpenOfferRequestService } from './open-offer-request.service';
import { OpenOfferRequestSubscription } from './open-offer-request.subscription';

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
