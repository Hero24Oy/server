import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { MakeDirectCardPayInInput } from '../graphql';
import { MangopayPayInService } from '../services/pay-in';

import { AuthGuard } from '$modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '$modules/firebase/firebase.exception.filter';

@Resolver()
@UseFilters(FirebaseExceptionFilter)
@UseGuards(AuthGuard)
export class MangopayPayInResolver {
  constructor(private readonly payInService: MangopayPayInService) {}

  @Mutation(() => Boolean)
  async makePayIn(
    @Args('input') input: MakeDirectCardPayInInput,
  ): Promise<boolean> {
    return this.payInService.makePayIn(input);
  }
}
