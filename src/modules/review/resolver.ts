import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { AuthGuard } from '../auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';

import { REVIEW_CREATED_SUBSCRIPTION } from './constants';
import {
  CreateReviewInput,
  CreateReviewOutput,
  ReviewListInput,
  ReviewListOutput,
  ReviewObject,
  SubscribeToReviewCreateInput,
  SubscribeToReviewCreateOutput,
} from './graphql';
import { ReviewService } from './service';
import { ReviewCreateSubscriptionFilter } from './utils';

@Resolver()
export class ReviewResolver {
  constructor(
    private readonly reviewService: ReviewService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  @Query(() => ReviewListOutput)
  @UseFilters(FirebaseExceptionFilter)
  // @UseGuards(AuthGuard)
  async reviewList(
    @Args('input') input: ReviewListInput,
  ): Promise<ReviewListOutput> {
    return this.reviewService.getReviewsList(input);
  }

  @Mutation(() => CreateReviewOutput)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async createReview(
    @Args('input') input: CreateReviewInput,
  ): Promise<CreateReviewOutput> {
    return this.reviewService.createReview(input);
  }

  @Subscription(() => SubscribeToReviewCreateOutput, {
    name: REVIEW_CREATED_SUBSCRIPTION,
    filter: ReviewCreateSubscriptionFilter(REVIEW_CREATED_SUBSCRIPTION),
    resolve: (payload: {
      reviewCreated: ReviewObject;
    }): SubscribeToReviewCreateOutput => ({
      review: payload.reviewCreated,
    }),
  })
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  subscribeToReviewCreate(
    @Args('input') _input: SubscribeToReviewCreateInput,
  ): AsyncIterator<unknown> {
    return this.pubSub.asyncIterator(REVIEW_CREATED_SUBSCRIPTION);
  }
}
