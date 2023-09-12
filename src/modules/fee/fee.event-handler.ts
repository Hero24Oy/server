import {
  FEE_CREATED_SUBSCRIPTION,
  FEE_UPDATED_SUBSCRIPTION,
} from './fee.constants';
import { createFeeEventHandler } from './fee.utils/create-fee-event-handler.util';

import { createSubscriptionEventEmitter } from '$/src/modules/graphql-pubsub/graphql-pubsub.utils';

export const createFeeUpdatedEventHandler = createFeeEventHandler(
  createSubscriptionEventEmitter(FEE_UPDATED_SUBSCRIPTION),
);

export const createFeeCreatedEventHandler = createFeeEventHandler(
  createSubscriptionEventEmitter(FEE_CREATED_SUBSCRIPTION),
);
