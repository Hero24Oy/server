import { UseFilters, UseGuards } from '@nestjs/common';
import { /* Args, Mutation, */ Resolver } from '@nestjs/graphql';

import { MangopayPayInService } from '../services/pay-in';

// import { CreateDirectCardPayInInput } from './graphql';
import { AuthGuard } from '$modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '$modules/firebase/firebase.exception.filter';

@Resolver()
@UseFilters(FirebaseExceptionFilter)
@UseGuards(AuthGuard)
export class MangopayPayInResolver {
  constructor(private readonly payInService: MangopayPayInService) {}

  // We need to confirm mangopay flow and then get author and wallet ids
  // @Mutation(() => Boolean)
  // async makePayIn(
  //   @Args('input') input: CreateDirectCardPayInInput,
  // ): Promise<boolean> {
  //  return this.payInService.makePayIn(input);
  // }
}
