import { Module } from '@nestjs/common';
import { FeeService } from './fee.service';
import { FeeResolver } from './fee.resolver';
import { FirebaseModule } from '../firebase/firebase.module';
import { OfferRequestModule } from '../offer-request/offer-request.module';
import { FeePriceCalculatorModule } from './fee-price-calculator/fee-price-calculator.module';

@Module({
  imports: [FirebaseModule, OfferRequestModule, FeePriceCalculatorModule],
  providers: [FeeService, FeeResolver],
  exports: [FeeService, FeePriceCalculatorModule],
})
export class FeeModule {}
