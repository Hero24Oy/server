import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { OfferRequestModule } from '../offer-request/offer-request.module';
import { GraphQLPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';
import { SubscriptionManagerModule } from '../subscription-manager/subscription-manager.module';

import { FeeService } from './fee.service';
import { FeeResolver } from './fee.resolver';
import { FeePriceCalculatorModule } from './fee-price-calculator/fee-price-calculator.module';
import { SorterModule } from '../sorter/sorter.module';
import { FEE_SORTERS } from './fee.sorters';
import { FeeSubscription } from './fee.subscription';

@Module({
  imports: [
    FirebaseModule,
    OfferRequestModule,
    FeePriceCalculatorModule,
    GraphQLPubsubModule,
    SorterModule.create(FEE_SORTERS),
    SubscriptionManagerModule.forFeature({
      imports: [GraphQLPubsubModule, FirebaseModule],
      subscriptions: [FeeSubscription],
    }),
  ],
  providers: [FeeService, FeeResolver],
  exports: [FeeService, FeePriceCalculatorModule],
})
export class FeeModule {}
