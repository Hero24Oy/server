import { createSubscriptionEventEmitter } from 'src/modules/graphql-pubsub/graphql-pubsub.utils';

import {
  CATEGORIES_CREATED_SUBSCRIPTION,
  CATEGORIES_UPDATED_SUBSCRIPTION,
} from './constants';
import { createCategoriesEventHandler } from './utils';

export const createCategoriesUpdatedEventHandler = createCategoriesEventHandler(
  createSubscriptionEventEmitter(CATEGORIES_UPDATED_SUBSCRIPTION),
);

export const createCategoriesCreatedEventHandler = createCategoriesEventHandler(
  createSubscriptionEventEmitter(CATEGORIES_CREATED_SUBSCRIPTION),
);
