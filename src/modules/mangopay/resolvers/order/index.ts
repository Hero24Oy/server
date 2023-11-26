import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { MangopayOrderService } from '../../services/order';

import { GeneratePaymentTokenInput } from './graphql';

import { AuthGuard } from '$modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '$modules/firebase/firebase.exception.filter';

@Resolver()
@UseFilters(FirebaseExceptionFilter)
@UseGuards(AuthGuard)
export class MangopayOrderResolver {
  constructor(private readonly orderService: MangopayOrderService) {}

  @Query(() => String)
  async generatePaymentToken(
    @Args('input') input: GeneratePaymentTokenInput,
  ): Promise<string> {
    const { transactionId } = input;

    return this.orderService.generatePaymentTokenByTransactionId(transactionId);
  }
}
