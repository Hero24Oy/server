import { createSubscriptionEventEmitter } from 'src/modules/graphql-pubsub/graphql-pubsub.utils';

import { PROMOTION_ADDED_SUBSCRIPTION } from '../promotion.constants';

export const emitPromotionAddedEvent = createSubscriptionEventEmitter(
  PROMOTION_ADDED_SUBSCRIPTION,
);
