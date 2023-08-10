import { createSubscriptionEventEmitter } from 'src/modules/graphql-pubsub/graphql-pubsub.utils';
import {
  PROMOTION_ADDED_SUBSCRIPTION,
  PROMOTION_UPDATED_SUBSCRIPTION,
  PROMOTION_REMOVED_SUBSCRIPTION,
} from './promotion.constants';
import { createPromotionsEventHandler } from './promotion.utils/create-promotion-event-handler.util';

export const createPromotionsUpdatedEventHandler = createPromotionsEventHandler(
  createSubscriptionEventEmitter(PROMOTION_UPDATED_SUBSCRIPTION),
);

export const createPromotionsAddedEventHandler = createPromotionsEventHandler(
  createSubscriptionEventEmitter(PROMOTION_ADDED_SUBSCRIPTION),
);

export const createPromotionsRemovedEventHandler = createPromotionsEventHandler(
  createSubscriptionEventEmitter(PROMOTION_REMOVED_SUBSCRIPTION),
);
