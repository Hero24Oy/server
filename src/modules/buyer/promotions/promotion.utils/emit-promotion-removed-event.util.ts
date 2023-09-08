import { createSubscriptionEventEmitter } from 'src/modules/graphql-pubsub/graphql-pubsub.utils';

import { PROMOTION_REMOVED_SUBSCRIPTION } from '../promotion.constants';

export const emitPromotionRemovedEvent = createSubscriptionEventEmitter(
  PROMOTION_REMOVED_SUBSCRIPTION,
);
