import { Args, Query, Resolver } from '@nestjs/graphql';

import { TaskReceiptOutput } from './graphql';
import { PriceCalculatorService } from './service';

@Resolver()
export class PriceCalculatorResolver {
  constructor(
    private readonly priceCalculatorService: PriceCalculatorService,
  ) {}

  @Query(() => TaskReceiptOutput)
  taskReceipt(@Args('taskId') offerId: string): Promise<TaskReceiptOutput> {
    return this.priceCalculatorService.getTaskReceipt(offerId);
  }
}
