import { forwardRef, Module } from '@nestjs/common';
import { FeeModule } from 'src/modules/fee/fee.module';
import { GraphQlPubsubModule } from 'src/modules/graphql-pubsub/graphql-pubsub.module';
import { HubSpotDealModule } from 'src/modules/hub-spot/hub-spot-deal/hub-spot-deal.module';
import { OfferRequestModule } from 'src/modules/offer-request/offer-request.module';
import { SubscriptionManagerModule } from 'src/modules/subscription-manager/subscription-manager.module';
import { UserModule } from 'src/modules/user/user.module';

// eslint-disable-next-line import/no-cycle
import { OfferModule } from '../offer.module';
import { OfferPriceCalculatorModule } from '../offer-price-calculator/offer-price-calculator.module';

import { OfferHubSpotService } from './offer-hub-spot.service';
import { OfferHubSpotSubscription } from './offer-hub-spot.subscription';

// We could add this module to the app module to avoid circular dependencies,
// but this module is part of the offer module, and we only needed to split the code on logic blocks.
@Module({
  imports: [
    forwardRef(() => OfferModule),
    UserModule,
    HubSpotDealModule,
    OfferRequestModule,
    OfferPriceCalculatorModule,
    FeeModule,
    SubscriptionManagerModule.forFeature({
      imports: [OfferHubSpotModule, GraphQlPubsubModule],
      subscriptions: [OfferHubSpotSubscription],
    }),
  ],
  providers: [OfferHubSpotService],
  exports: [OfferHubSpotService],
})
export class OfferHubSpotModule {}
