import { createSubscriptionEventEmitter } from 'src/modules/graphql-pubsub/graphql-pubsub.utils';

import {
  CATEGORY_CREATED_SUBSCRIPTION,
  CATEGORY_UPDATED_SUBSCRIPTION,
} from './constants';
import { createCategoriesEventHandler } from './utils';

export const createCategoriesUpdatedEventHandler = createCategoriesEventHandler(
  createSubscriptionEventEmitter(CATEGORY_UPDATED_SUBSCRIPTION),
);

export const createCategoriesCreatedEventHandler = createCategoriesEventHandler(
  createSubscriptionEventEmitter(CATEGORY_CREATED_SUBSCRIPTION),
);
