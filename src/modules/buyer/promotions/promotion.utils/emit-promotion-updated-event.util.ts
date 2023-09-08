import { createSubscriptionEventEmitter } from 'src/modules/graphql-pubsub/graphql-pubsub.utils';

import { PROMOTION_UPDATED_SUBSCRIPTION } from '../promotion.constants';

export const emitPromotionUpdatedEvent = createSubscriptionEventEmitter(
  PROMOTION_UPDATED_SUBSCRIPTION,
);
