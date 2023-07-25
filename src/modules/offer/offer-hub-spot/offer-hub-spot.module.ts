import { Module, forwardRef } from '@nestjs/common';

import { SubscriptionManagerModule } from 'src/modules/subscription-manager/subscription-manager.module';
import { HubSpotDealModule } from 'src/modules/hub-spot/hub-spot-deal/hub-spot-deal.module';
import { UserModule } from 'src/modules/user/user.module';
import { OfferRequestModule } from 'src/modules/offer-request/offer-request.module';
import { FirebaseModule } from 'src/modules/firebase/firebase.module';

import { OfferPriceCalculatorModule } from '../offer-price-calculator/offer-price-calculator.module';
import { OfferHubSpotService } from './offer-hub-spot.service';
import { OfferHubSpotSubscription } from './offer-hub-spot.subscription';
import { OfferModule } from '../offer.module';
import { FeeModule } from 'src/modules/fee/fee.module';

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
      imports: [FirebaseModule, OfferHubSpotModule],
      subscriptions: [OfferHubSpotSubscription],
    }),
  ],
  providers: [OfferHubSpotService],
  exports: [OfferHubSpotService],
})
export class OfferHubSpotModule {}
