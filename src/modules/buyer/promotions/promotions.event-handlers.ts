import { createSubscriptionEventEmitter } from 'src/modules/graphql-pubsub/graphql-pubsub.utils';
import {
  PROMOTIONS_ADDED_SUBSCRIPTION,
  PROMOTIONS_UPDATED_SUBSCRIPTION,
  PROMOTIONS_REMOVED_SUBSCRIPTION,
} from './promotions.constants';
import { createPromotionsEventHandler } from './promotion.utils/create-promotion-event-handler.util';

export const createPromotionsUpdatedEventHandler = createPromotionsEventHandler(
  createSubscriptionEventEmitter(PROMOTIONS_UPDATED_SUBSCRIPTION),
);

export const createPromotionsAddedEventHandler = createPromotionsEventHandler(
  createSubscriptionEventEmitter(PROMOTIONS_ADDED_SUBSCRIPTION),
);

export const createPromotionsRemovedEventHandler = createPromotionsEventHandler(
  createSubscriptionEventEmitter(PROMOTIONS_REMOVED_SUBSCRIPTION),
);
