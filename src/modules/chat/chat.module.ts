import { Inject, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import { skipFirst } from '../common/common.utils';
import { FirebaseModule } from '../firebase/firebase.module';
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
import { ChatMirror } from './mirrors/chat.mirror';
import { ChatMessageMirror } from './mirrors/chat-message.mirror';
import { ChatResolver } from './resolvers/chat.resolver';
import { ChatFieldsResolver } from './resolvers/chat-fields.resolver';
import { ChatMemberFieldsResolver } from './resolvers/chat-member-fields.resolver';
import { ChatMessageResolver } from './resolvers/chat-message.resolver';
import { ChatService } from './services/chat.service';
import { ChatMessageService } from './services/chat-message.service';

import { SubscriptionManagerModule } from '$modules/subscription-manager/subscription-manager.module';

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
    SubscriptionManagerModule.forFeature({
      imports: [FirebaseModule],
      subscriptions: [ChatMirror, ChatMessageMirror],
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
    private readonly chatService: ChatService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  onApplicationBootstrap(): void {
    this.subscribeOnChatUpdates(this.pubSub);
  }

  subscribeOnChatUpdates(pubsub: PubSub): void {
    const { chatTableRef } = this.chatService;

    const unsubscribes = [
      subscribeOnFirebaseEvent(
        chatTableRef,
        'child_changed',
        createChatUpdatedEventHandler(pubsub),
      ),
      subscribeOnFirebaseEvent(
        // Firebase child added event calls on every exist item first, than on every creation event.
        // So we should skip every exists items using limit to last 1 so as not to retrieve all items
        // !IMPORTANT
        // * limitToLast(1) retrieves from database only the last item
        // * So if added node is not the last one, this event won't trigger
        // * Using firebase push() method to create node ensures that this item will be the last one
        chatTableRef.limitToLast(1),
        'child_added',
        skipFirst(createChatAddedEventHandler(pubsub)),
      ),
    ];

    ChatModule.unsubscribes.push(...unsubscribes);
  }

  async beforeApplicationShutdown(): Promise<void> {
    await Promise.all(
      ChatModule.unsubscribes.map((unsubscribe) => unsubscribe()),
    );

    ChatModule.unsubscribes = [];
  }
}
