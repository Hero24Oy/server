import { Module } from '@nestjs/common';
import { FirebaseModule } from '../../firebase/firebase.module';
import { GraphQLPubsubModule } from '../../graphql-pubsub/graphql-pubsub.module';
import { PromotionResolver } from './promotion.resolver';
import { PromotionService } from './promotion.service';
import { PromotionSubscription } from './promotion.subscription';
import { SubscriptionManagerModule } from 'src/modules/subscription-manager/subscription-manager.module';

@Module({
  imports: [
    FirebaseModule,
    GraphQLPubsubModule,
    SubscriptionManagerModule.forFeature({
      imports: [GraphQLPubsubModule, FirebaseModule],
      subscriptions: [PromotionSubscription],
    }),
  ],
  providers: [PromotionService, PromotionResolver],
})
export class PromotionModule {}
