import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { REVIEW_UPDATED_SUBSCRIPTION } from './review.constants';
import { ReviewService } from './review.service';
import { ReviewSubscriptionFilter } from './review.utils/review-subscription-filter.util';
import { ReviewCreationArgs } from './dto/creation/review-creation.args';
import { ReviewDto } from './dto/review/review.dto';
import { ReviewFilterInput } from './dto/review/review-filter.input';

import { AuthGuard } from '../auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { ReviewListDto } from './dto/review-list/review-list.dto';
import { ReviewListArgs } from './dto/review-list/review-list.args';

@Resolver()
export class ReviewResolver {
  constructor(
    private readonly reviewService: ReviewService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  @Query(() => ReviewListDto)
  // @UseFilters(FirebaseExceptionFilter)
  // @UseGuards(AuthGuard)
  async reviewList(@Args() args: ReviewListArgs): Promise<ReviewListDto> {
    return this.reviewService.getReviews(args);
  }

  @Mutation(() => ReviewDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async createReview(@Args() args: ReviewCreationArgs): Promise<ReviewDto> {
    return this.reviewService.createReview(args);
  }

  @Subscription(() => ReviewDto, {
    name: REVIEW_UPDATED_SUBSCRIPTION,
    filter: ReviewSubscriptionFilter(REVIEW_UPDATED_SUBSCRIPTION),
  })
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  subscribeOnReviewUpdate(@Args('filter') _filter: ReviewFilterInput) {
    return this.pubSub.asyncIterator(REVIEW_UPDATED_SUBSCRIPTION);
  }
}
