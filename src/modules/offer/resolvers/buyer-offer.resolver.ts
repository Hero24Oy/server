import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { OfferIdInput } from '../dto/editing/offer-id.input';
import { BuyerOfferService } from '../services/buyer-offer.service';

import { AuthGuard } from '$modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '$modules/firebase/firebase.exception.filter';

@UseGuards(AuthGuard)
@UseFilters(FirebaseExceptionFilter)
@Resolver()
export class BuyerOfferResolver {
  constructor(private readonly buyerOfferService: BuyerOfferService) {}

  @Mutation(() => Boolean)
  markOfferAsSeenByBuyer(
    @Args('input') { offerId }: OfferIdInput,
  ): Promise<boolean> {
    return this.buyerOfferService.markOfferAsSeenByBuyer(offerId);
  }

  @Mutation(() => Boolean)
  declineExtendOffer(
    @Args('input') { offerId }: OfferIdInput,
  ): Promise<boolean> {
    return this.buyerOfferService.declineExtendOffer(offerId);
  }

  @Mutation(() => Boolean)
  approveCompletedOffer(
    @Args('input') { offerId }: OfferIdInput,
  ): Promise<boolean> {
    return this.buyerOfferService.approveCompletedOffer(offerId);
  }

  @Mutation(() => Boolean)
  approvePrepaidOffer(@Args('input') input: OfferIdInput): Promise<boolean> {
    return this.buyerOfferService.approvePrepaidOffer(input);
  }
}
