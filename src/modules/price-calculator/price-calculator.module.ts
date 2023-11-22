import { Module } from '@nestjs/common';

import { PriceCalculatorService } from './price-calculator.service';

@Module({
  providers: [PriceCalculatorService],
})
export class PriceCalculatorModule {}
