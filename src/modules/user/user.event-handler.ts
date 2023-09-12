import {
  USER_CREATED_SUBSCRIPTION,
  USER_UPDATED_SUBSCRIPTION,
} from './user.constants';
import { createUserEventHandler } from './user.utils/create-user-event-handler.util';

import { createSubscriptionEventEmitter } from '$/src/modules/graphql-pubsub/graphql-pubsub.utils';

export const createUserUpdatedEventHandler = createUserEventHandler(
  createSubscriptionEventEmitter(USER_UPDATED_SUBSCRIPTION),
);

export const createUserCreatedEventHandler = createUserEventHandler(
  createSubscriptionEventEmitter(USER_CREATED_SUBSCRIPTION),
);
