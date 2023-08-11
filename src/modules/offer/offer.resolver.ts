import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import { OfferService } from './offer.service';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { OFFER_UPDATED_SUBSCRIPTION } from './offer.constants';
import { OfferExtendInput } from './dto/editing/offer-extend.input';
import { OfferCompletedInput } from './dto/editing/offer-completed.input';
import { OfferStatusInput } from './dto/editing/offer-status.input';
import { OfferChangeInput } from './dto/editing/offer-change.input';
import { OfferDto } from './dto/offer/offer.dto';
import { OfferArgs } from './dto/offers/offers.args';
import { OfferListDto } from './dto/offers/offer-list.dto';
import { Identity } from '../auth/auth.types';
import { AuthIdentity } from '../auth/auth.decorator';
import { AppGraphQLContext } from 'src/app.types';

@Resolver()
export class OfferResolver {
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
  markOfferAsSeenBySeller(@Args('offerId') offerId: string): Promise<boolean> {
    return this.offerService.markOfferAsSeenBySeller(offerId);
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
  @Subscription(() => OfferDto, {
    name: OFFER_UPDATED_SUBSCRIPTION,
    filter: (
      payload: { [OFFER_UPDATED_SUBSCRIPTION]: OfferDto },
      variables: { offerIds: string[]; isBuyer: boolean },
      { identity }: AppGraphQLContext,
    ) => {
      // if ids are provided, filter by them
      if (variables.offerIds) {
        return variables.offerIds.includes(
          payload[OFFER_UPDATED_SUBSCRIPTION].id,
        );
      }

      if (identity?.isAdmin) {
        return true;
      }

      const { buyerProfileId, sellerProfileId } =
        payload[OFFER_UPDATED_SUBSCRIPTION].data.initial;

      if (variables.isBuyer) {
        return buyerProfileId === identity?.id;
      } else {
        return sellerProfileId === identity?.id;
      }
    },
  })
  @UseFilters(FirebaseExceptionFilter)
  subscribeOnOfferUpdated(
    @Args('offerIds', { type: () => [String], nullable: true })
    _offerIds: string[],
    @Args('isBuyer', { nullable: true })
    _isBuyer: boolean,
    @AuthIdentity() _identity: Identity,
  ) {
    return this.pubSub.asyncIterator(OFFER_UPDATED_SUBSCRIPTION);
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
  extendOfferDuration(
    @Args('offerId') offerId: string,
    @Args('input') input: OfferExtendInput,
  ): Promise<boolean> {
    return this.offerService.extendOfferDuration(offerId, input);
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
  updateOfferStatus(
    @Args('offerId') offerId: string,
    @Args('input') input: OfferStatusInput,
  ): Promise<boolean> {
    return this.offerService.updateOfferStatus(offerId, input);
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
  acceptOfferChanges(
    @Args('offerId') offerId: string,
    @Args('input') input: OfferChangeInput,
  ): Promise<boolean> {
    return this.offerService.acceptOfferChanges(offerId, input);
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

  // TODO test this
  // TODO auth guards
  // @UseGuards(AuthGuard)
  @Query(() => OfferListDto)
  @UseFilters(FirebaseExceptionFilter)
  offers(
    @AuthIdentity() identity: Identity,
    @Args({ type: () => OfferArgs }) args: OfferArgs,
    @Args('isBuyer', { nullable: true, defaultValue: true }) isBuyer: boolean,
  ): Promise<OfferListDto> {
    return this.offerService.getOffers(args, identity, isBuyer);
  }
}
