import { DataSnapshot } from 'firebase-admin/database';
import { PubSub } from 'graphql-subscriptions';
import { ReviewDB } from 'hero24-types';

import { ReviewDto } from '../dto/review/review.dto';

export const createReviewEventHandler =
  (eventEmitter: (pubsub: PubSub, review: ReviewDto) => void) =>
  (pubsub: PubSub) =>
  (snapshot: DataSnapshot) => {
    if (!snapshot.key) {
      return;
    }

    const reviewBD: ReviewDB = snapshot.val();

    eventEmitter(
      pubsub,
      ReviewDto.adapter.toExternal({ ...reviewBD, id: snapshot.key }),
    );
  };
