import { Module } from '@nestjs/common';

import { PriceCalculatorResolver } from './resolver';
import { PriceCalculatorService } from './service';

import { FeeModule } from '$modules/fee/fee.module';
import { FeePriceCalculatorModule } from '$modules/fee/fee-price-calculator/fee-price-calculator.module';
import { FirebaseModule } from '$modules/firebase/firebase.module';
import { OfferModule } from '$modules/offer/offer.module';
import { OfferPriceCalculatorModule } from '$modules/offer/offer-price-calculator/offer-price-calculator.module';
import { OfferRequestModule } from '$modules/offer-request/offer-request.module';

@Module({
  imports: [
    OfferModule,
    OfferRequestModule,
    FeeModule,
    FirebaseModule,
    FeePriceCalculatorModule,
    OfferPriceCalculatorModule,
  ],
  providers: [PriceCalculatorService, PriceCalculatorResolver],
})
export class PriceCalculatorModule {}
