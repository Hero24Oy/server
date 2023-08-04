import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { OfferService } from './offer.service';
import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PubSub } from 'graphql-subscriptions';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { OFFER_UPDATED_SUBSCRIPTION } from './offer.constants';
import { OfferDto } from './dto/offer/offer.dto';
import { FirebaseApp } from '../firebase/firebase.decorator';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { OfferExtendInput } from './dto/editing/offer-extend.input';
import { OfferCompletedInput } from './dto/editing/offer-completed.input';
import { OfferStatusInput } from './dto/editing/offer-status.input';
import { OfferChangeInput } from './dto/editing/offer-change.input';

@Resolver()
export class OfferResolver {
  constructor(
    private readonly offerService: OfferService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  // @UseGuards(AuthGuard)
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
  approveCompletedOffer(
    @Args('offerId') offerId: string,
    @Args('offerRequestId') offerRequestId: string,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<boolean> {
    return this.offerService.approveCompletedOffer(
      offerId,
      offerRequestId,
      app,
    );
  }

  @UseGuards(AuthGuard)
  @Subscription(() => OfferDto, {
    name: OFFER_UPDATED_SUBSCRIPTION,
    filter: (
      payload: { [OFFER_UPDATED_SUBSCRIPTION]: OfferDto },
      variables: { offerId: OfferDto['id'] },
    ) => {
      const { offerId } = variables;

      return payload[OFFER_UPDATED_SUBSCRIPTION].id === offerId;
    },
  })
  @UseFilters(FirebaseExceptionFilter)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  subscribeOnOfferUpdated(@Args('offerId') _offerId: string) {
    return this.pubSub.asyncIterator(OFFER_UPDATED_SUBSCRIPTION);
  }

  // TODO add auth guards
  // @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  cancelRequestToExtend(@Args('offerId') offerId: string): Promise<boolean> {
    return this.offerService.cancelRequestToExtend(offerId);
  }

  // @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  extendOfferDuration(
    @Args('offerId') offerId: string,
    @Args('input') input: OfferExtendInput,
  ): Promise<boolean> {
    return this.offerService.extendOfferDuration(offerId, input);
  }

  // @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  markJobCompleted(
    @Args('offerId') offerId: string,
    @Args('input') input: OfferCompletedInput,
  ): Promise<boolean> {
    return this.offerService.markJobCompleted(offerId, input);
  }

  // @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  declineOfferChanges(@Args('offerId') offerId: string): Promise<boolean> {
    return this.offerService.declineOfferChanges(offerId);
  }

  // @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  updateOfferStatus(
    @Args('offerId') offerId: string,
    @Args('input') input: OfferStatusInput,
  ): Promise<boolean> {
    return this.offerService.updateOfferStatus(offerId, input);
  }

  // @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  startJob(@Args('offerId') offerId: string): Promise<boolean> {
    return this.offerService.startJob(offerId);
  }

  // @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  toggleJobStatus(@Args('offerId') offerId: string): Promise<boolean> {
    return this.offerService.toggleJobStatus(offerId);
  }

  // @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  acceptOfferChanges(
    @Args('offerId') offerId: string,
    @Args('input') input: OfferChangeInput,
  ): Promise<boolean> {
    return this.offerService.acceptOfferChanges(offerId, input);
  }
}
