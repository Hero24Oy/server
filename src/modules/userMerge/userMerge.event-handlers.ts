import { createSubscriptionEventEmitter } from 'src/modules/graphql-pubsub/graphql-pubsub.utils';
import { USERMERGE_ADDED_SUBSCRIPTION, USERMERGE_UPDATED_SUBSCRIPTION } from './userMerge.constants';
import { createUserMergeEventHandler } from './userMerge.utils/create-usermerge-event-handler.util';

export const createUserMergeUpdatedEventHandler = createUserMergeEventHandler(
  createSubscriptionEventEmitter(USERMERGE_UPDATED_SUBSCRIPTION),
);

export const createUserMergeAddedEventHandler = createUserMergeEventHandler(
  createSubscriptionEventEmitter(USERMERGE_ADDED_SUBSCRIPTION),
);
