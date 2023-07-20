import { createSubscriptionEventEmitter } from 'src/modules/graphql-pubsub/graphql-pubsub.utils';
import { CATEGORIES_UPDATED_SUBSCRIPTION } from './categories.constants';
import { createCategoriesEventHandler } from './create-categories-event-handler.util';

/*
export const createUserMergeUpdatedEventHandler = createUserMergeEventHandler(
  createSubscriptionEventEmitter(USERMERGE_UPDATED_SUBSCRIPTION),
);
*/

export const createCategoriesUpdatedEventHandler = createCategoriesEventHandler(
  createSubscriptionEventEmitter(CATEGORIES_UPDATED_SUBSCRIPTION),
);
