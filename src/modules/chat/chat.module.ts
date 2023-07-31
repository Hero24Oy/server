import { Inject, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import { ChatFieldsResolver } from './resolvers/chat-fields.resolver';
import { ChatResolver } from './resolvers/chat.resolver';
import { ChatService } from './services/chat.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQLPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseAdminAppInstance } from '../firebase/firebase.types';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { subscribeOnFirebaseEvent } from '../firebase/firebase.utils';
import { ChatMessageService } from './services/chat-message.service';
import { ChatMessageResolver } from './resolvers/chat-message.resolver';
import { ChatMemberFieldsResolver } from './resolvers/chat-member-fields.resolver';
import { UserModule } from '../user/user.module';
import { SellerModule } from '../seller/seller.module';
import { BuyerModule } from '../buyer/buyer.module';
import { SorterModule } from '../sorter/sorter.module';
import { CHAT_SORTERS } from './chat.sorters';
import {
  createChatAddedEventHandler,
  createChatUpdatedEventHandler,
} from './chat.event-handlers';
import { skipFirst } from '../common/common.utils';

@Module({
  imports: [
    FirebaseModule,
    GraphQLPubsubModule,
    UserModule,
    SellerModule,
    BuyerModule,
    SorterModule.create(CHAT_SORTERS),
  ],
  providers: [
    ChatResolver,
    ChatService,
    ChatFieldsResolver,
    ChatMessageService,
    ChatMessageResolver,
    ChatMemberFieldsResolver,
  ],
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
