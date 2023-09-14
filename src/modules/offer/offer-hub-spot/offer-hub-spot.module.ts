import { forwardRef, Module } from '@nestjs/common';

import { OfferModule } from '../offer.module';
import { OfferPriceCalculatorModule } from '../offer-price-calculator/offer-price-calculator.module';

import { OfferHubSpotService } from './offer-hub-spot.service';
import { OfferHubSpotSubscription } from './offer-hub-spot.subscription';

import { FeeModule } from '$modules/fee/fee.module';
import { GraphQlPubsubModule } from '$modules/graphql-pubsub/graphql-pubsub.module';
import { HubSpotDealModule } from '$modules/hub-spot/hub-spot-deal/hub-spot-deal.module';
import { OfferRequestModule } from '$modules/offer-request/offer-request.module';
import { SubscriptionManagerModule } from '$modules/subscription-manager/subscription-manager.module';
import { UserModule } from '$modules/user/user.module';

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
