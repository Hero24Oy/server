import { Module, forwardRef } from '@nestjs/common';
import { OpenOfferRequestService } from './open-offer-request.service';
import { OpenOfferRequestResolver } from './open-offer-request.resolver';
import { SubscriptionManagerModule } from 'src/modules/subscription-manager/subscription-manager.module';
import { OpenOfferRequestSubscription } from './open-offer-request.subscription';
import { OfferRequestModule } from '../offer-request.module';
import { FirebaseModule } from 'src/modules/firebase/firebase.module';
import { GraphQLPubsubModule } from 'src/modules/graphql-pubsub/graphql-pubsub.module';

@Module({
  imports: [
    forwardRef(() => OfferRequestModule),
    FirebaseModule,
    GraphQLPubsubModule,
    SubscriptionManagerModule.forFeature({
      imports: [OpenOfferRequestModule],
      subscriptions: [OpenOfferRequestSubscription],
    }),
  ],
  providers: [OpenOfferRequestService, OpenOfferRequestResolver],
  exports: [OpenOfferRequestService],
})
export class OpenOfferRequestModule {}
