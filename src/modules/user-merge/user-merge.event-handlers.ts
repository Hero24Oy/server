import {
  USERMERGE_ADDED_SUBSCRIPTION,
  USERMERGE_UPDATED_SUBSCRIPTION,
} from './user-merge.constants';
import { createUserMergeEventHandler } from './user-merge.utils/create-user-merge-event-handler.util';

import { createSubscriptionEventEmitter } from '$modules/graphql-pubsub/graphql-pubsub.utils';

export const createUserMergeUpdatedEventHandler = createUserMergeEventHandler(
  createSubscriptionEventEmitter(USERMERGE_UPDATED_SUBSCRIPTION),
);

export const createUserMergeAddedEventHandler = createUserMergeEventHandler(
  createSubscriptionEventEmitter(USERMERGE_ADDED_SUBSCRIPTION),
);
