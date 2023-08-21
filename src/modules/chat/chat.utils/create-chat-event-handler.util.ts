import { DataSnapshot } from 'firebase-admin/database';
import { PubSub } from 'graphql-subscriptions';

import { ChatDto } from '../dto/chat/chat.dto';

export const createChatEventHandler =
  (eventEmitter: (pubsub: PubSub, chat: ChatDto) => void) =>
  (pubsub: PubSub) =>
  (snapshot: DataSnapshot) => {
    if (!snapshot.key) {
      return;
    }

    eventEmitter(
      pubsub,
      ChatDto.adapter.toExternal({ ...snapshot.val(), id: snapshot.key }),
    );
  };
