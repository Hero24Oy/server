import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { OfferInput } from '../dto/creation/offer.input';
import { OfferChangeInput } from '../dto/editing/offer-change.input';
import { OfferCompletedInput } from '../dto/editing/offer-completed.input';
import { OfferExtendInput } from '../dto/editing/offer-extend.input';
import { OfferIdInput } from '../dto/editing/offer-id.input';
import { OfferStatusInput } from '../dto/editing/offer-status.input';
import { OfferDto } from '../dto/offer/offer.dto';
import { emitOfferCreatedEvent } from '../offer.utils/emit-offer-created-event.util';
import { OfferService } from '../services/offer.service';
import { SellerOfferService } from '../services/seller-offer.service';

import { AuthGuard } from '$/src/modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '$/src/modules/firebase/firebase.exception.filter';
import { PUBSUB_PROVIDER } from '$/src/modules/graphql-pubsub/graphql-pubsub.constants';

@UseGuards(AuthGuard)
@UseFilters(FirebaseExceptionFilter)
@Resolver()
export class SellerOfferResolver {
  constructor(
    private readonly sellerOfferService: SellerOfferService,
    private readonly offerService: OfferService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  @Mutation(() => Boolean)
  markOfferAsSeenBySeller(
    @Args('input') { offerId }: OfferIdInput,
  ): Promise<boolean> {
    return this.sellerOfferService.markOfferAsSeenBySeller(offerId);
  }

  @Mutation(() => Boolean)
  extendOfferDuration(
    @Args('input') input: OfferExtendInput,
  ): Promise<boolean> {
    return this.sellerOfferService.extendOfferDuration(input);
  }

  @Mutation(() => Boolean)
  cancelRequestToExtend(
    @Args('input') { offerId }: OfferIdInput,
  ): Promise<boolean> {
    return this.sellerOfferService.cancelRequestToExtend(offerId);
  }

  @Mutation(() => Boolean)
  markJobCompleted(
    @Args('input') input: OfferCompletedInput,
  ): Promise<boolean> {
    return this.sellerOfferService.markJobCompleted(input);
  }

  @Mutation(() => Boolean)
  declineOfferChanges(
    @Args('input') { offerId }: OfferIdInput,
  ): Promise<boolean> {
    return this.sellerOfferService.declineOfferChanges(offerId);
  }

  @Mutation(() => Boolean)
  startJob(@Args('input') { offerId }: OfferIdInput): Promise<boolean> {
    return this.sellerOfferService.startJob(offerId);
  }

  @Mutation(() => Boolean)
  toggleJobStatus(@Args('input') { offerId }: OfferIdInput): Promise<boolean> {
    return this.sellerOfferService.toggleJobStatus(offerId);
  }

  @Mutation(() => Boolean)
  updateOfferStatus(@Args('input') input: OfferStatusInput): Promise<boolean> {
    return this.offerService.updateOfferStatus(input);
  }

  @Mutation(() => Boolean)
  acceptOfferChanges(@Args('input') input: OfferChangeInput): Promise<boolean> {
    return this.sellerOfferService.acceptOfferChanges(input);
  }

  @Mutation(() => OfferDto)
  async createOffer(@Args('input') input: OfferInput): Promise<OfferDto> {
    const offer = await this.sellerOfferService.createOffer(input);

    emitOfferCreatedEvent(this.pubSub, offer);

    return offer;
  }
}
