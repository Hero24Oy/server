import { PubSub } from 'graphql-subscriptions';
import { ChatDB } from 'hero24-types';

import { ChatDto } from '../dto/chat/chat.dto';

import { FirebaseSnapshot } from '$/modules/firebase/firebase.types';

export const createChatEventHandler =
  (eventEmitter: (pubsub: PubSub, chat: ChatDto) => void) =>
  (pubsub: PubSub) =>
  (snapshot: FirebaseSnapshot<ChatDB>) => {
    const chat = snapshot.val();

    if (!snapshot.key || !chat) {
      return;
    }

    eventEmitter(
      pubsub,
      ChatDto.adapter.toExternal({ ...chat, id: snapshot.key }),
    );
  };
