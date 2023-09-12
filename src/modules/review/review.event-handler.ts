import { REVIEW_UPDATED_SUBSCRIPTION } from './review.constants';
import { createReviewEventHandler } from './review.utils/create-review-event-handler.util';

import { createSubscriptionEventEmitter } from '$/src/modules/graphql-pubsub/graphql-pubsub.utils';

export const createReviewUpdatedEventHandler = createReviewEventHandler(
  createSubscriptionEventEmitter(REVIEW_UPDATED_SUBSCRIPTION),
);
