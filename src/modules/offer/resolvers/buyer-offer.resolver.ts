import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseFilters, UseGuards } from '@nestjs/common';

import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from 'src/modules/firebase/firebase.exception.filter';
import { BuyerOfferService } from '../services/buyer-offer.service';

@Resolver()
export class BuyerOfferResolver {
  constructor(private readonly buyerOfferService: BuyerOfferService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  markOfferAsSeenByBuyer(@Args('offerId') offerId: string): Promise<boolean> {
    return this.buyerOfferService.markOfferAsSeenByBuyer(offerId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  declineExtendOffer(@Args('offerId') offerId: string): Promise<boolean> {
    return this.buyerOfferService.declineExtendOffer(offerId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  approveCompletedOffer(@Args('offerId') offerId: string): Promise<boolean> {
    return this.buyerOfferService.approveCompletedOffer(offerId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  approvePrepaidOffer(
    @Args('offerId') offerId: string,
    @Args('offerRequestId') offerRequestId: string,
  ): Promise<boolean> {
    return this.buyerOfferService.approvePrepaidOffer(offerId, offerRequestId);
  }
}
