import {
  NEWS_ADDED_SUBSCRIPTION,
  NEWS_REMOVED_SUBSCRIPTION,
  NEWS_UPDATED_SUBSCRIPTION,
} from './news.constants';
import { createNewsEventHandler } from './news.utils/create-news-event-handler.util';

import { createSubscriptionEventEmitter } from '$modules/graphql-pubsub/graphql-pubsub.utils';

export const createNewsUpdatedEventHandler = createNewsEventHandler(
  createSubscriptionEventEmitter(NEWS_UPDATED_SUBSCRIPTION),
);

export const createNewsAddedEventHandler = createNewsEventHandler(
  createSubscriptionEventEmitter(NEWS_ADDED_SUBSCRIPTION),
);

export const createNewsRemovedEventHandler = createNewsEventHandler(
  createSubscriptionEventEmitter(NEWS_REMOVED_SUBSCRIPTION),
);
