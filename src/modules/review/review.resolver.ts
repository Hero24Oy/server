import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { AuthGuard } from '../auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';

import { ReviewDataInput } from './dto/creation/review-data.input';
import { ReviewDto } from './dto/review/review.dto';
import { SubscribeToReviewUpdateInput } from './dto/review/subscribe-to-review-update.input';
import { ReviewListDto } from './dto/review-list/review-list.dto';
import { ReviewListInput } from './dto/review-list/review-list.input';
import { REVIEW_UPDATED_SUBSCRIPTION } from './review.constants';
import { ReviewService } from './review.service';
import { ReviewSubscriptionFilter } from './review.utils/review-subscription-filter.util';

@Resolver()
export class ReviewResolver {
  constructor(
    private readonly reviewService: ReviewService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  @Query(() => ReviewListDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async reviewList(
    @Args('input') input: ReviewListInput,
  ): Promise<ReviewListDto> {
    return this.reviewService.getReviews(input);
  }

  @Mutation(() => ReviewDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async createReview(@Args('input') args: ReviewDataInput): Promise<ReviewDto> {
    return this.reviewService.createReview(args);
  }

  @Subscription(() => ReviewDto, {
    name: REVIEW_UPDATED_SUBSCRIPTION,
    filter: ReviewSubscriptionFilter(REVIEW_UPDATED_SUBSCRIPTION),
  })
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  subscribeOnReviewUpdate(
    @Args('input') _input: SubscribeToReviewUpdateInput,
  ): AsyncIterator<unknown> {
    return this.pubSub.asyncIterator(REVIEW_UPDATED_SUBSCRIPTION);
  }
}
