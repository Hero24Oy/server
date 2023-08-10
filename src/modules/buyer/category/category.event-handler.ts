import { createSubscriptionEventEmitter } from 'src/modules/graphql-pubsub/graphql-pubsub.utils';
import { CATEGORIES_UPDATED_SUBSCRIPTION } from './category.constants';
import { createCategoriesEventHandler } from './create-category-event-handler.util';

export const createCategoriesUpdatedEventHandler = createCategoriesEventHandler(
  createSubscriptionEventEmitter(CATEGORIES_UPDATED_SUBSCRIPTION),
);
