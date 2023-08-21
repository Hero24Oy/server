import { Module } from '@nestjs/common';

import { OfferPriceCalculatorService } from './offer-price-calculator.service';

@Module({
  providers: [OfferPriceCalculatorService],
  exports: [OfferPriceCalculatorService],
})
export class OfferPriceCalculatorModule {}
