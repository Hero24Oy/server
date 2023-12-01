import { Args, Query, Resolver } from '@nestjs/graphql';

import { TaskReceiptInput, TaskReceiptOutput } from './graphql';
import { PriceCalculatorService } from './service';

@Resolver()
export class PriceCalculatorResolver {
  constructor(
    private readonly priceCalculatorService: PriceCalculatorService,
  ) {}

  @Query(() => TaskReceiptOutput)
  async taskReceipt(
    @Args('input') input: TaskReceiptInput,
  ): Promise<TaskReceiptOutput> {
    const receipt = await this.priceCalculatorService.getTaskReceipt(
      input.taskId,
    );

    return { receipt };
  }
}
