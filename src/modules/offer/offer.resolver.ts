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

@Resolver()
export class OfferResolver {
  constructor(
    private readonly offerService: OfferService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  markOfferAsSeen(@Args('offerId') offerId: string): Promise<boolean> {
    return this.offerService.markOfferAsSeen(offerId);
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
}
