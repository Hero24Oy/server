import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQlPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';
import { OfferRequestModule } from '../offer-request/offer-request.module';
import { SorterModule } from '../sorter/sorter.module';
import { SubscriptionManagerModule } from '../subscription-manager/subscription-manager.module';

import { FeeMirror } from './fee.mirror';
import { FeeResolver } from './fee.resolver';
import { FeeService } from './fee.service';
import { FEE_SORTERS } from './fee.sorters';
import { FeeSubscription } from './fee.subscription';
import { FeePriceCalculatorModule } from './fee-price-calculator/fee-price-calculator.module';

@Module({
  imports: [
    FirebaseModule,
    OfferRequestModule,
    FeePriceCalculatorModule,
    GraphQlPubsubModule,
    SorterModule.create(FEE_SORTERS),
    SubscriptionManagerModule.forFeature({
      imports: [FirebaseModule, GraphQlPubsubModule, FeeModule],
      subscriptions: [FeeSubscription, FeeMirror],
    }),
  ],
  providers: [FeeService, FeeResolver],
  exports: [FeeService, FeePriceCalculatorModule],
})
export class FeeModule {}
