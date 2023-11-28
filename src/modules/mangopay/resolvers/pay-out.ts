import { UseFilters, UseGuards } from '@nestjs/common';
import { /* Args, Mutation, */ Resolver } from '@nestjs/graphql';

import { MangopayPayOutService } from '../services/pay-out';

// import { CreatePayOutInput } from './graphql';
import { AuthGuard } from '$modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '$modules/firebase/firebase.exception.filter';

@Resolver()
@UseFilters(FirebaseExceptionFilter)
@UseGuards(AuthGuard)
export class MangopayPayOutResolver {
  constructor(private readonly payOutService: MangopayPayOutService) {}

  // We need to confirm mangopay flow and then get author and wallet ids
  // @Mutation(() => Boolean)
  // async makePayOut(
  //   @Args('input') input: CreatePayOutInput,
  // ): Promise<boolean> {
  //   return this.payoutService.makePayOut(input);
  // }
}
