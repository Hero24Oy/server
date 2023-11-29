import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { MakeDirectCardPayInInput, PaymentTokenInput } from '../graphql';
import { MangopayPayInService } from '../services/pay-in';

import { AuthGuard } from '$modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '$modules/firebase/firebase.exception.filter';

@Resolver()
@UseFilters(FirebaseExceptionFilter)
@UseGuards(AuthGuard)
export class MangopayPayInResolver {
  constructor(private readonly payInService: MangopayPayInService) {}

  @Query(() => String)
  async paymentToken(@Args('input') input: PaymentTokenInput): Promise<string> {
    const { transactionId } = input;

    return this.payInService.generatePaymentTokenByTransactionId(transactionId);
  }

  @Mutation(() => Boolean)
  async makePayIn(
    @Args('input') input: MakeDirectCardPayInInput,
  ): Promise<boolean> {
    return this.payInService.makePayIn(input);
  }
}
