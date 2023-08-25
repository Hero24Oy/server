import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { OfferRequestCreationInput } from './dto/creation/offer-request-creation.input';
import { OfferRequestDto } from './dto/offer-request/offer-request.dto';
import { OfferRequestPurchaseArgs } from './dto/offer-request-purchase/offer-request-purchase.args';
import { OfferRequestService } from './offer-request.service';
import { AdminGuard } from '../auth/guards/admin.guard';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { OfferRequestListDto } from './dto/offer-request-list/offer-request-list.dto';
import { OfferRequestListArgs } from './dto/offer-request-list/offer-request-list.args';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthIdentity } from '../auth/auth.decorator';
import { Identity } from '../auth/auth.types';
import { OFFER_REQUEST_UPDATED_SUBSCRIPTION } from './offer-request.constants';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { getOfferRequestSubscriptionFilter } from './offer-request.utils/offer-request-subscription-filter.util';

@Resolver()
export class OfferRequestResolver {
  constructor(
    private offerRequestService: OfferRequestService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  @Query(() => OfferRequestDto, { nullable: true })
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async offerRequest(
    @Args('id') offerRequestId: string,
  ): Promise<OfferRequestDto | null> {
    return this.offerRequestService.getOfferRequestById(offerRequestId);
  }

  @Query(() => OfferRequestListDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async offerRequestList(
    @Args() args: OfferRequestListArgs,
    @AuthIdentity() identity: Identity,
  ): Promise<OfferRequestListDto> {
    return this.offerRequestService.getOfferRequestList(args, identity);
  }

  @Mutation(() => OfferRequestDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async createOfferRequest(
    @Args('input') input: OfferRequestCreationInput,
  ): Promise<OfferRequestDto> {
    return this.offerRequestService.createOfferRequest(input);
  }

  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AdminGuard)
  async updateOfferRequestPurchase(
    @Args() { input }: OfferRequestPurchaseArgs,
  ): Promise<boolean> {
    await this.offerRequestService.updatePurchase(input);

    this.offerRequestService.emitOfferRequestUpdated(input.id);

    return true;
  }

  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async markOfferRequestReviewed(
    @Args('id') offerRequestId: string,
  ): Promise<boolean> {
    await this.offerRequestService.markOfferRequestReviewed(offerRequestId);

    this.offerRequestService.emitOfferRequestUpdated(offerRequestId);

    return true;
  }

  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async cancelOfferRequest(
    @Args('id') offerRequestId: string,
  ): Promise<boolean> {
    await this.offerRequestService.cancelOfferRequest(offerRequestId);

    this.offerRequestService.emitOfferRequestUpdated(offerRequestId);

    return true;
  }

  @Subscription(() => OfferRequestDto, {
    name: OFFER_REQUEST_UPDATED_SUBSCRIPTION,
    filter: getOfferRequestSubscriptionFilter(
      OFFER_REQUEST_UPDATED_SUBSCRIPTION,
    ),
  })
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async subscribeToOfferRequestUpdates() {
    return this.pubSub.asyncIterator(OFFER_REQUEST_UPDATED_SUBSCRIPTION);
  }
}
