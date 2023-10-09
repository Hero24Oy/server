import { USER_UPDATED_SUBSCRIPTION } from '../user.constants';

import { createSubscriptionEventEmitter } from '$modules/graphql-pubsub/graphql-pubsub.utils';

export const emitUserUpdated = createSubscriptionEventEmitter(
  USER_UPDATED_SUBSCRIPTION,
);
