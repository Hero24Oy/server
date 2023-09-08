import { Module } from '@nestjs/common';

import { SubscriptionManagerModule } from 'src/modules/subscription-manager/subscription-manager.module';

import { FirebaseModule } from '../../firebase/firebase.module';
import { GraphQLPubsubModule } from '../../graphql-pubsub/graphql-pubsub.module';
import { PromotionResolver } from './promotion.resolver';
import { PromotionService } from './promotion.service';
import { PromotionSubscription } from './promotion.subscription';

@Module({
  imports: [
    FirebaseModule,
    GraphQLPubsubModule,
    SubscriptionManagerModule.forFeature({
      imports: [FirebaseModule, PromotionModule],
      subscriptions: [PromotionSubscription],
    }),
  ],
  providers: [PromotionService, PromotionResolver],
  exports: [PromotionService],
})
export class PromotionModule {}
