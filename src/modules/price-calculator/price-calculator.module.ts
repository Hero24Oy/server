import { Module } from '@nestjs/common';

import { PriceCalculatorResolver } from './price-calculator.resolver';
import { PriceCalculatorService } from './price-calculator.service';

import { FeeModule } from '$modules/fee/fee.module';
import { FirebaseModule } from '$modules/firebase/firebase.module';
import { OfferModule } from '$modules/offer/offer.module';
import { OfferRequestModule } from '$modules/offer-request/offer-request.module';

@Module({
  imports: [OfferModule, OfferRequestModule, FeeModule, FirebaseModule],
  providers: [PriceCalculatorService, PriceCalculatorResolver],
})
export class PriceCalculatorModule {}
