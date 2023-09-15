import { Module } from '@nestjs/common';

import { SubscriptionManagerModule } from 'src/modules/subscription-manager/subscription-manager.module';

import { FirebaseModule } from '../../firebase/firebase.module';
import { PromotionService } from './services/promotion.service';
import { PromotionSubscription } from './promotion.subscription';
import { AdminPromotionResolver } from './resolvers/admin-promotions.resolver';
import { PromotionResolver } from './resolvers/promotions.resolver';
import { AdminPromotionService } from './services/admin-promotion.service';
import { GraphQlPubsubModule } from '$/modules/graphql-pubsub/graphql-pubsub.module';

@Module({
  imports: [
    FirebaseModule,
    GraphQlPubsubModule,
    SubscriptionManagerModule.forFeature({
      imports: [FirebaseModule, PromotionModule],
      subscriptions: [PromotionSubscription],
    }),
  ],
  providers: [
    AdminPromotionResolver,
    PromotionResolver,
    PromotionService,
    AdminPromotionService,
  ],
  exports: [PromotionService, AdminPromotionService],
})
export class PromotionModule {}
