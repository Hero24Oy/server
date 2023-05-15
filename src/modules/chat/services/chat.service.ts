import { ChatDB } from 'hero24-types';
import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { getDatabase, set, ref, get } from 'firebase/database';
import { getDatabase as getAdminDatabase } from 'firebase-admin/database';
import orderBy from 'lodash/orderBy';
import map from 'lodash/map';
import getValue from 'lodash/get';

import { FirebaseAppInstance } from '../../firebase/firebase.types';
import { FirebaseDatabasePath } from '../../firebase/firebase.constants';
import { MaybeType } from '../../common/common.types';
import { FirebaseService } from '../../firebase/firebase.service';
import { ChatMessageDto } from '../dto/chat/chat-message.dto';
import { PUBSUB_PROVIDER } from '../../graphql-pubsub/graphql-pubsub.constants';
import { Identity } from '../../auth/auth.types';
import { ChatsArgs } from '../dto/chats/chats.args';
import { ChatsDto } from '../dto/chats/chats.dto';
import { ChatDto } from '../dto/chat/chat.dto';
import { SeenByAdminUpdatedDto } from '../dto/subscriptions/seen-by-admin-updated.dto';
import { ChatMemberAdditionArgs } from '../dto/editing/chat-member-addition.args';
import { filterChats } from '../chat.utils';
import {
  CHAT_SEEN_BY_ADMIN_UPDATED_SUBSCRIPTION,
  ChatColumnDefaultValues,
} from '../chat.constants';
import { ChatsOrderColumn } from '../dto/chats/chats-order-column.enum';
import { SortOrder } from 'src/modules/common/sort-order/sort-order.enum';

@Injectable()
export class ChatService {
  constructor(
    private firebaseService: FirebaseService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  async getChats(args: ChatsArgs, identity: Identity): Promise<ChatsDto> {
    const { limit, offset, filter, ordersBy = [] } = args;

    const database = getAdminDatabase(this.firebaseService.getDefaultApp());
    const chatsSnapshot = await database
      .ref(FirebaseDatabasePath.CHATS)
      .once('value');

    const chats: ChatDto[] = [];

    chatsSnapshot.forEach((snapshot) => {
      if (!snapshot.key) {
        return;
      }

      const chat: ChatDB = snapshot.val();

      chats.push(ChatDto.convertFromFirebaseType(chat, snapshot.key));
    });

    const hasPagination =
      typeof limit === 'number' && typeof offset === 'number';

    let chatEdges = filterChats(chats, identity, filter);

    const total = chatEdges.length;

    // lodash.orderBy:
    // orderBy(array, [...columns] || valuePicker, [...sortOrders])
    // Example 1. orderBy(
    //    [{ a: 1, b: 2 }, { a: 2, b: 1 }],
    //    ['a', 'b'],
    //    ['asc', 'desc']
    //  )
    // Example 2. orderBy(
    //    [{ a: 'hello', b: 'world' }, { a: undefined, b: undefined }],
    //    (item) => [item.a || '', item.b || '',
    //    ['desc', 'asc']
    //  )
    const columns: ChatsOrderColumn[] = map(ordersBy, 'column');
    const orders: SortOrder[] = map(ordersBy, 'order');

    const valuePicker = (item: ChatDto) =>
      map(
        columns,
        (column) => getValue(item, column) || ChatColumnDefaultValues[column],
      );

    chatEdges = orderBy(chatEdges, valuePicker, orders);

    if (hasPagination) {
      chatEdges = chatEdges.slice(offset, limit + offset);
    }

    const edges = chatEdges.map((chat) => ({ node: chat, cursor: chat.id }));

    const chatsDto: ChatsDto = {
      edges,
      endCursor: edges[edges.length - 1]?.cursor || null,
      hasNextPage: !hasPagination ? false : offset + limit < total,
      total,
    };

    return chatsDto;
  }

  async getChatById(
    chatId: string,
    app: FirebaseAppInstance,
  ): Promise<ChatDto> {
    const path = [FirebaseDatabasePath.CHATS, chatId];
    const database = getDatabase(app);

    const chatSnapshot = await get(ref(database, path.join('/')));
    const chat: MaybeType<ChatDB> = chatSnapshot.val();

    if (!chat) {
      throw new Error(`Chat isn't existed`);
    }

    return ChatDto.convertFromFirebaseType(chat, chatId);
  }

  async getChat(
    chatId: string,
    app: FirebaseAppInstance,
  ): Promise<ChatDto | null> {
    const database = getDatabase(app);

    const path = [FirebaseDatabasePath.CHATS, chatId];
    const chatSnapshot = await get(ref(database, path.join('/')));

    const chat: ChatDB = chatSnapshot.val();

    return chat && ChatDto.convertFromFirebaseType(chat, chatId);
  }

  async getUnseenChatsCount(): Promise<number> {
    const database = getAdminDatabase(this.firebaseService.getDefaultApp());

    const chatsSnapshot = await database.ref(FirebaseDatabasePath.CHATS).get();

    let result = 0;

    chatsSnapshot.forEach((snapshot) => {
      if (snapshot.exists()) {
        const chat: ChatDB = snapshot.val();

        if (chat.data.inviteAdmin && !chat.data.seenByAdmin) {
          result++;
        }
      }
    });

    return result;
  }

  async setChatSeenByAdmin(
    chatId: string,
    seenByAdmin: boolean,
    app: FirebaseAppInstance,
  ) {
    const database = getDatabase(app);
    const path = [FirebaseDatabasePath.CHATS, chatId, 'data', 'seenByAdmin'];
    const seenByAdminRef = ref(database, path.join('/'));

    const snapshot = await get(seenByAdminRef);

    const previousSeenByAdmin: boolean | null = snapshot.val();

    await set(seenByAdminRef, seenByAdmin);

    const seenByAdminUpdatedDto: SeenByAdminUpdatedDto = {
      previous: previousSeenByAdmin,
      current: seenByAdmin,
      chatId,
    };

    this.pubSub.publish(CHAT_SEEN_BY_ADMIN_UPDATED_SUBSCRIPTION, {
      [CHAT_SEEN_BY_ADMIN_UPDATED_SUBSCRIPTION]: seenByAdminUpdatedDto,
    });

    return seenByAdmin;
  }

  async setChatReclamationResolved(
    chatId: string,
    isAboutReclamation: boolean,
    app: FirebaseAppInstance,
  ): Promise<boolean> {
    const database = getDatabase(app);
    const path = [
      FirebaseDatabasePath.CHATS,
      chatId,
      'data',
      'isAboutReclamation',
    ];
    const isAboutReclamationRef = ref(database, path.join('/'));

    await set(isAboutReclamationRef, isAboutReclamation);

    return isAboutReclamation;
  }

  async addMemberToChat(
    args: ChatMemberAdditionArgs,
    app: FirebaseAppInstance,
  ): Promise<boolean> {
    const { userId, chatId, role } = args;

    const database = getDatabase(app);

    const path = [
      FirebaseDatabasePath.CHATS,
      chatId,
      'data',
      'members',
      userId,
    ];

    const chatMember: ChatDB['data']['members'][string] = {
      role,
    };

    await set(ref(database, path.join('/')), chatMember);

    return true;
  }

  async checkMessageCreationRights(
    identity: Identity,
    chatId: string,
    app: FirebaseAppInstance,
  ) {
    const chat = await this.getChatById(chatId, app);

    if (!chat.members.some(({ id }) => id === identity.id)) {
      throw new Error(`User should be a member of chat`);
    }
  }

  async attachChatMessageToChat(
    chatId: string,
    chatMessage: ChatMessageDto,
    app: FirebaseAppInstance,
  ) {
    const database = getDatabase(app);

    const chatPath = [
      FirebaseDatabasePath.CHATS,
      chatId,
      'data',
      'messages',
      chatMessage.id,
    ];

    const chatRef = ref(database, chatPath.join('/'));

    await set(chatRef, true);
  }
}
