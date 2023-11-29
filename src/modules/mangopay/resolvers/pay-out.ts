import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { MakePayOutInput } from '../graphql';
import { MangopayPayOutService } from '../services/pay-out';

import { AuthGuard } from '$modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '$modules/firebase/firebase.exception.filter';

@Resolver()
@UseFilters(FirebaseExceptionFilter)
@UseGuards(AuthGuard)
export class MangopayPayOutResolver {
  constructor(private readonly payOutService: MangopayPayOutService) {}

  @Mutation(() => Boolean)
  async makePayOut(@Args('input') input: MakePayOutInput): Promise<boolean> {
    return this.payOutService.makePayOut(input);
  }
}
