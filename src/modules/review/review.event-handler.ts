import { createSubscriptionEventEmitter } from 'src/modules/graphql-pubsub/graphql-pubsub.utils';

import { REVIEW_UPDATED_SUBSCRIPTION } from './review.constants';
import { createReviewEventHandler } from './review.utils/create-review-event-handler.util';

export const createBuyerProfileUpdatedEventHandler = createReviewEventHandler(
  createSubscriptionEventEmitter(REVIEW_UPDATED_SUBSCRIPTION),
);
