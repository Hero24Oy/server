import { Inject, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import * as adminDatabase from 'firebase-admin/database';

import { ChatFieldsResolver } from './resolvers/chat-fields.resolver';
import { ChatResolver } from './resolvers/chat.resolver';
import { ChatService } from './services/chat.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQLPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseAdminAppInstance } from '../firebase/firebase.types';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import {
  CHAT_ADDED_SUBSCRIPTION,
  CHAT_UPDATED_SUBSCRIPTION,
} from './chat.constants';
import { ChatDto } from './dto/chat/chat.dto';
import { subscribeOnFirebaseEvent } from '../firebase/firebase.utils';
import { ChatMessageService } from './services/chat-message.service';
import { ChatMessageResolver } from './resolvers/chat-message.resolver';

@Module({
  imports: [FirebaseModule, GraphQLPubsubModule],
  providers: [
    ChatResolver,
    ChatService,
    ChatFieldsResolver,
    ChatMessageService,
    ChatMessageResolver,
  ],
})
export class ChatModule {
  static unsubscribes: Array<() => void> = [];

  constructor(
    private firebaseService: FirebaseService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  onApplicationBootstrap() {
    this.subscribeOnChatUpdates(
      this.firebaseService.getDefaultApp(),
      this.pubSub,
    );
  }

  subscribeOnChatUpdates(app: FirebaseAdminAppInstance, pubsub: PubSub) {
    const database = adminDatabase.getDatabase(app);
    const chatsRef = database.ref(FirebaseDatabasePath.CHATS);

    const getEventHandler =
      (subscriptionName: string, triggerName = subscriptionName) =>
      (snap: adminDatabase.DataSnapshot) => {
        if (!snap.key) {
          return;
        }

        pubsub.publish(triggerName, {
          [subscriptionName]: ChatDto.convertFromFirebaseType(
            snap.val(),
            snap.key,
          ),
        });
      };

    const unsubscribes = [
      subscribeOnFirebaseEvent(
        chatsRef,
        'child_changed',
        getEventHandler(CHAT_UPDATED_SUBSCRIPTION),
      ),
      subscribeOnFirebaseEvent(
        chatsRef,
        'child_added',
        getEventHandler(CHAT_ADDED_SUBSCRIPTION),
      ),
    ];

    ChatModule.unsubscribes.push(...unsubscribes);
  }

  async beforeApplicationShutdown() {
    await Promise.all(
      ChatModule.unsubscribes.map((unsubscribe) => unsubscribe()),
    );

    ChatModule.unsubscribes = [];
  }
}
