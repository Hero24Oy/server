import { UseFilters, UseGuards } from '@nestjs/common';
import { /* Args, Mutation, */ Resolver } from '@nestjs/graphql';

import { SellerService } from '../../../seller/seller.service';
import { MangopayPayOutService } from '../../services/pay-out';

// import { CreatePayOutInput } from './graphql';
import { AuthGuard } from '$modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '$modules/firebase/firebase.exception.filter';

@Resolver()
@UseFilters(FirebaseExceptionFilter)
@UseGuards(AuthGuard)
export class MangopayPayOutResolver {
  constructor(
    private readonly payOutService: MangopayPayOutService,
    private readonly sellerService: SellerService,
  ) {}

  // We need to confirm mangopay flow and then get author and wallet ids
  // @Mutation(() => Boolean)
  // async createPayOut(
  //   @Args('input') input: CreatePayOutInput,
  // ): Promise<boolean> {
  //   const { heroId, amount } = input;

  //   const hero = await this.sellerService.getSellerById(heroId);

  //   if (!hero) {
  //     throw new Error('Transaction owner not found');
  //   }

  //   await this.payOutService.createPayOut({
  //     fee: 0,
  //     amount,
  //   });

  //   return true;
  // }
}
