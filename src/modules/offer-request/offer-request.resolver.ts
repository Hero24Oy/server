import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { AuthIdentity } from '../auth/auth.decorator';
import { Identity } from '../auth/auth.types';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';

import { OfferRequestCreationInput } from './dto/creation/offer-request-creation.input';
import { OfferRequestUpdateAddressesInput } from './dto/editing/offer-request-update-addresses.input';
import { OfferRequestUpdateQuestionsInput } from './dto/editing/offer-request-update-questions.input';
import { OfferRequestDto } from './dto/offer-request/offer-request.dto';
import { OfferRequestListArgs } from './dto/offer-request-list/offer-request-list.args';
import { OfferRequestListDto } from './dto/offer-request-list/offer-request-list.dto';
import { OfferRequestPurchaseArgs } from './dto/offer-request-purchase/offer-request-purchase.args';
import { OfferRequestUpdatedSubscriptionArgs } from './dto/subscriptions/offer-request-updated-subscription.args';
import { OFFER_REQUEST_UPDATED_SUBSCRIPTION } from './offer-request.constants';
import { OfferRequestService } from './offer-request.service';
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

    return true;
  }

  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async markOfferRequestReviewed(
    @Args('id') offerRequestId: string,
  ): Promise<boolean> {
    await this.offerRequestService.markOfferRequestReviewed(offerRequestId);

    return true;
  }

  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async cancelOfferRequest(
    @Args('id') offerRequestId: string,
  ): Promise<boolean> {
    await this.offerRequestService.cancelOfferRequest(offerRequestId);

    return true;
  }

  @Mutation(() => OfferRequestDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async updateOfferRequestAddresses(
    @Args('input') input: OfferRequestUpdateAddressesInput,
  ): Promise<OfferRequestDto> {
    return this.offerRequestService.updateOfferRequestAddresses(input);
  }

  @Mutation(() => OfferRequestDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async updateOfferRequestQuestions(
    @Args('input') input: OfferRequestUpdateQuestionsInput,
  ): Promise<OfferRequestDto> {
    return this.offerRequestService.updateOfferRequestQuestions(input);
  }

  @Subscription(() => OfferRequestDto, {
    name: OFFER_REQUEST_UPDATED_SUBSCRIPTION,
    filter: getOfferRequestSubscriptionFilter(
      OFFER_REQUEST_UPDATED_SUBSCRIPTION,
    ),
  })
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async subscribeToOfferRequestUpdates(
    @Args() _args: OfferRequestUpdatedSubscriptionArgs,
  ) {
    return this.pubSub.asyncIterator(OFFER_REQUEST_UPDATED_SUBSCRIPTION);
  }
}
