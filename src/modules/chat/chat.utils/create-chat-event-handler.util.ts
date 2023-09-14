import { DataSnapshot } from 'firebase-admin/database';
import { PubSub } from 'graphql-subscriptions';
import { ChatDB } from 'hero24-types';

import { ChatDto } from '../dto/chat/chat.dto';

export const createChatEventHandler =
  (eventEmitter: (pubsub: PubSub, chat: ChatDto) => void) =>
  (pubsub: PubSub) =>
  (snapshot: DataSnapshot) => {
    if (!snapshot.key) {
      return;
    }

    const chat: ChatDB = snapshot.val();

    eventEmitter(
      pubsub,
      ChatDto.adapter.toExternal({ ...chat, id: snapshot.key }),
    );
  };
