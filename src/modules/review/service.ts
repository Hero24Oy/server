import { Injectable } from '@nestjs/common';
import { ReviewDB } from 'hero24-types';
import omit from 'lodash/omit';

import { paginate, preparePaginatedResult } from '../common/common.utils';
import { SellerService } from '../seller/seller.service';

import {
  CreateReviewInput,
  CreateReviewOutput,
  ReviewListInput,
  ReviewListOutput,
  ReviewObject,
} from './graphql';

import { MaybeType } from '$modules/common/common.types';
import { FirebaseDatabasePath } from '$modules/firebase/firebase.constants';
import { FirebaseService } from '$modules/firebase/firebase.service';
import { FirebaseTableReference } from '$modules/firebase/firebase.types';

@Injectable()
export class ReviewService {
  readonly reviewTableRef: FirebaseTableReference<ReviewDB>;

  constructor(
    private readonly sellerService: SellerService,
    firebaseService: FirebaseService,
  ) {
    const database = firebaseService.getDefaultApp().database();

    this.reviewTableRef = database.ref(FirebaseDatabasePath.REVIEWS);
  }

  async getReview(id: string): Promise<MaybeType<ReviewObject>> {
    const reviewSnapshot = await this.reviewTableRef.child(id).get();

    const review = reviewSnapshot.val();

    return review ? ReviewObject.adapter.toExternal({ ...review, id }) : null;
  }

  async getAllReviews(): Promise<Record<string, ReviewDB>> {
    const allReviewsSnapshot = await this.reviewTableRef.get();

    const allReviews: Record<string, ReviewDB> = allReviewsSnapshot.val() ?? {};

    return allReviews;
  }

  async getReviewsList(input: ReviewListInput): Promise<ReviewListOutput> {
    const { sellerId, offset, limit } = input;

    const seller = await this.sellerService.strictGetSellerById(sellerId);

    const allReviews = await this.getAllReviews();

    let nodes = Object.entries(allReviews)
      .filter(([id]) => seller.reviews?.includes(id))
      .map(([id, review]) =>
        ReviewObject.adapter.toExternal({ ...review, id }),
      );

    const total = nodes.length;

    nodes = paginate({ nodes, offset, limit });

    return preparePaginatedResult({
      nodes,
      total,
      offset,
      limit,
    });
  }

  async createReview(input: CreateReviewInput): Promise<CreateReviewOutput> {
    const internalReview = ReviewObject.adapter.toInternal({
      ...input,
      createdAt: new Date(),
      id: '',
    });

    const review: ReviewDB = omit(internalReview, 'id');

    const reviewRef = await this.reviewTableRef.push();

    if (!reviewRef.key) {
      throw new Error('Failed to create review');
    }

    await reviewRef.set(review);

    return {
      review: ReviewObject.adapter.toExternal({
        ...internalReview,
        id: reviewRef.key,
      }),
    };
  }
}
