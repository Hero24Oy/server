import { Args, Query, Resolver } from '@nestjs/graphql';

import { TaskReceiptInput, TaskReceiptOutput } from './graphql';
import { PriceCalculatorService } from './service';

@Resolver()
export class PriceCalculatorResolver {
  constructor(
    private readonly priceCalculatorService: PriceCalculatorService,
  ) {}

  // * taskReceipt is triggered by cloud to send receipts
  // TODO add auth guards when cloud functions are eliminated
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
