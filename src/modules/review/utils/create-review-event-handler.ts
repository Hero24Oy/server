import { PubSub } from 'graphql-subscriptions';
import { ReviewDB } from 'hero24-types';

import { ReviewObject } from '../graphql/objects/review';

import { FirebaseSnapshot } from '$modules/firebase/firebase.types';

export const createReviewEventHandler =
  (eventEmitter: (pubsub: PubSub, review: ReviewObject) => void) =>
  (pubsub: PubSub) =>
  (snapshot: FirebaseSnapshot<ReviewDB>) => {
    if (!snapshot.key) {
      return;
    }

    const reviewDB = snapshot.val();

    if (reviewDB) {
      eventEmitter(
        pubsub,
        ReviewObject.adapter.toExternal({ ...reviewDB, id: snapshot.key }),
      );
    }
  };
