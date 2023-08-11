import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from 'src/modules/firebase/firebase.exception.filter';
import { PUBSUB_PROVIDER } from 'src/modules/graphql-pubsub/graphql-pubsub.constants';

import { OfferService } from '../offer.service';

@Resolver()
export class BuyerOfferResolver {
  constructor(
    private readonly offerService: OfferService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  markOfferAsSeenByBuyer(@Args('offerId') offerId: string): Promise<boolean> {
    return this.offerService.markOfferAsSeenByBuyer(offerId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  declineExtendOffer(@Args('offerId') offerId: string): Promise<boolean> {
    return this.offerService.declineExtendOffer(offerId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  approveCompletedOffer(@Args('offerId') offerId: string): Promise<boolean> {
    return this.offerService.approveCompletedOffer(offerId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  approvePrepaidOffer(
    @Args('offerId') offerId: string,
    @Args('offerRequestId') offerRequestId: string,
  ): Promise<boolean> {
    return this.offerService.approvePrepaidOffer(offerId, offerRequestId);
  }
}
