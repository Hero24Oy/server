import { USER_CREATED_SUBSCRIPTION } from '../user.constants';

import { createSubscriptionEventEmitter } from '$/modules/graphql-pubsub/graphql-pubsub.utils';

export const emitUserCreated = createSubscriptionEventEmitter(
  USER_CREATED_SUBSCRIPTION,
);
