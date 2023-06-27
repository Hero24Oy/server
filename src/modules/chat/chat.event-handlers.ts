import { createSubscriptionEventEmitter } from 'src/modules/graphql-pubsub/graphql-pubsub.utils';
import {
  CHAT_ADDED_SUBSCRIPTION,
  CHAT_UPDATED_SUBSCRIPTION,
} from './chat.constants';
import { createChatEventHandler } from './chat.utils/create-chat-event-handler.util';

export const createChatUpdatedEventHandler = createChatEventHandler(
  createSubscriptionEventEmitter(CHAT_UPDATED_SUBSCRIPTION),
);

export const createChatAddedEventHandler = createChatEventHandler(
  createSubscriptionEventEmitter(CHAT_ADDED_SUBSCRIPTION),
);
