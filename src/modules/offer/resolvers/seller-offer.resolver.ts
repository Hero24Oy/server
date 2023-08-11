import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from 'src/modules/firebase/firebase.exception.filter';
import { PUBSUB_PROVIDER } from 'src/modules/graphql-pubsub/graphql-pubsub.constants';

import { OfferChangeInput } from '../dto/editing/offer-change.input';
import { OfferCompletedInput } from '../dto/editing/offer-completed.input';
import { OfferExtendInput } from '../dto/editing/offer-extend.input';
import { OfferService } from '../offer.service';
import { OfferStatusInput } from '../dto/editing/offer-status.input';

@Resolver()
export class SellerOfferResolver {
  constructor(
    private readonly offerService: OfferService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  markOfferAsSeenBySeller(@Args('offerId') offerId: string): Promise<boolean> {
    return this.offerService.markOfferAsSeenBySeller(offerId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  extendOfferDuration(
    @Args('offerId') offerId: string,
    @Args('input') input: OfferExtendInput,
  ): Promise<boolean> {
    return this.offerService.extendOfferDuration(offerId, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  cancelRequestToExtend(@Args('offerId') offerId: string): Promise<boolean> {
    return this.offerService.cancelRequestToExtend(offerId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  markJobCompleted(
    @Args('offerId') offerId: string,
    @Args('input') input: OfferCompletedInput,
  ): Promise<boolean> {
    return this.offerService.markJobCompleted(offerId, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  declineOfferChanges(@Args('offerId') offerId: string): Promise<boolean> {
    return this.offerService.declineOfferChanges(offerId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  startJob(@Args('offerId') offerId: string): Promise<boolean> {
    return this.offerService.startJob(offerId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  toggleJobStatus(@Args('offerId') offerId: string): Promise<boolean> {
    return this.offerService.toggleJobStatus(offerId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  updateOfferStatus(
    @Args('offerId') offerId: string,
    @Args('input') input: OfferStatusInput,
  ): Promise<boolean> {
    return this.offerService.updateOfferStatus(offerId, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  acceptOfferChanges(
    @Args('offerId') offerId: string,
    @Args('input') input: OfferChangeInput,
  ): Promise<boolean> {
    return this.offerService.acceptOfferChanges(offerId, input);
  }
}
