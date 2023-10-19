import { createSubscriptionEventEmitter } from 'src/modules/graphql-pubsub/graphql-pubsub.utils';

import { REVIEW_CREATED_SUBSCRIPTION } from './constants';
import { createReviewEventHandler } from './utils/create-review-event-handler';

export const createReviewCreationEventHandler = createReviewEventHandler(
  createSubscriptionEventEmitter(REVIEW_CREATED_SUBSCRIPTION),
);
