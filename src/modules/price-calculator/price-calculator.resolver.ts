import { Args, Query, Resolver } from '@nestjs/graphql';

import { ReceiptDto } from './dto';
import { PriceCalculatorService } from './price-calculator.service';

@Resolver()
export class PriceCalculatorResolver {
  constructor(
    private readonly priceCalculatorService: PriceCalculatorService,
  ) {}

  @Query(() => ReceiptDto)
  taskReceipt(@Args('taskId') offerId: string): Promise<ReceiptDto> {
    return this.priceCalculatorService.getTaskReceipt(offerId);
  }
}
