import { Injectable } from '@nestjs/common';
import { Database } from 'firebase-admin/database';
import { ReviewDB } from 'hero24-types';
import omit from 'lodash/omit';

import { ReviewCreationArgs } from './dto/creation/review-creation.args';
import { ReviewDto } from './dto/review/review.dto';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { SellerService } from '../seller/seller.service';
import { paginate, preparePaginatedResult } from '../common/common.utils';
import { ReviewListArgs } from './dto/review-list/review-list.args';
import { ReviewListDto } from './dto/review-list/review-list.dto';

@Injectable()
export class ReviewService {
  database: Database;

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly sellerService: SellerService,
  ) {
    this.database = this.firebaseService.getDefaultApp().database();
  }

  async getReview(id: string): Promise<ReviewDto> {
    const reviewSnapshot = await this.database
      .ref(FirebaseDatabasePath.REVIEWS)
      .child(id)
      .get();

    const review: ReviewDB = await reviewSnapshot.val();

    return ReviewDto.adapter.toExternal({ ...review, id });
  }

  async getReviews(args: ReviewListArgs): Promise<ReviewListDto> {
    const { id, offset, limit } = args;

    const seller = await this.sellerService.strictGetSellerById(id);

    const allReviewsSnapshot = await this.database
      .ref(FirebaseDatabasePath.REVIEWS)
      .get();

    const allReviews: Record<string, ReviewDB> = allReviewsSnapshot.val();

    let nodes = Object.entries(allReviews)
      .filter(([id]) => seller.reviews?.includes(id))
      .map(([id, review]) => ReviewDto.adapter.toExternal({ ...review, id }));

    const total = nodes.length;
    nodes = paginate({ nodes, offset, limit });

    return preparePaginatedResult({
      nodes,
      total,
      offset,
      limit,
    });
  }

  async createReview(args: ReviewCreationArgs): Promise<ReviewDto> {
    const { input } = args;

    const internalReview = ReviewDto.adapter.toInternal({
      ...input,
      createdAt: new Date(),
      id: '',
    });

    const review: ReviewDB = omit(internalReview, 'id');

    const reviewRef = await this.database
      .ref(FirebaseDatabasePath.REVIEWS)
      .push();

    if (!reviewRef.key) {
      throw new Error('Failed to create review');
    }

    await reviewRef.set(review);

    return ReviewDto.adapter.toExternal({
      ...internalReview,
      id: reviewRef.key,
    });
  }
}
