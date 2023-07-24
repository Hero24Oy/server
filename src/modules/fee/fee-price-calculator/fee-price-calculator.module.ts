import { Module } from '@nestjs/common';
import { FeePriceCalculatorService } from './fee-price-calculator.service';

@Module({
  providers: [FeePriceCalculatorService],
  exports: [FeePriceCalculatorService],
})
export class FeePriceCalculatorModule {}
