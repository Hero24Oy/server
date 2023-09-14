import { Inject, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import { skipFirst } from '../common/common.utils';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseModule } from '../firebase/firebase.module';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseAdminAppInstance } from '../firebase/firebase.types';
import { subscribeOnFirebaseEvent } from '../firebase/firebase.utils';
import { GraphQlContextManagerModule } from '../graphql-context-manager/graphql-context-manager.module';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { GraphQlPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';
import { OfferRequestModule } from '../offer-request/offer-request.module';
import { SorterModule } from '../sorter/sorter.module';

import { ChatContext } from './chat.context';
import {
  createChatAddedEventHandler,
  createChatUpdatedEventHandler,
} from './chat.event-handlers';
import { CHAT_SORTERS } from './chat.sorters';
import { ChatResolver } from './resolvers/chat.resolver';
import { ChatFieldsResolver } from './resolvers/chat-fields.resolver';
import { ChatMemberFieldsResolver } from './resolvers/chat-member-fields.resolver';
import { ChatMessageResolver } from './resolvers/chat-message.resolver';
import { ChatService } from './services/chat.service';
import { ChatMessageService } from './services/chat-message.service';

@Module({
  imports: [
    FirebaseModule,
    GraphQlPubsubModule,
    OfferRequestModule,
    SorterModule.create(CHAT_SORTERS),
    GraphQlContextManagerModule.forFeature({
      imports: [ChatModule],
      contexts: [ChatContext],
    }),
  ],
  providers: [
    ChatResolver,
    ChatService,
    ChatFieldsResolver,
    ChatMessageService,
    ChatMessageResolver,
    ChatMemberFieldsResolver,
  ],
  exports: [ChatMessageService],
})
export class ChatModule {
  static unsubscribes: Array<() => Promise<void> | void> = [];

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
    const database = app.database();
    const chatsRef = database.ref(FirebaseDatabasePath.CHATS);

    const unsubscribes = [
      subscribeOnFirebaseEvent(
        chatsRef,
        'child_changed',
        createChatUpdatedEventHandler(pubsub),
      ),
      subscribeOnFirebaseEvent(
        // Firebase child added event calls on every exist item first, than on every creation event.
        // So we should skip every exists items using limit to last 1 so as not to retrieve all items
        chatsRef.limitToLast(1),
        'child_added',
        skipFirst(createChatAddedEventHandler(pubsub)),
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
