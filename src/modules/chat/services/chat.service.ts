import { ChatDB } from 'hero24-types';
import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { getDatabase, set, ref, get } from 'firebase/database';
import { getDatabase as getAdminDatabase } from 'firebase-admin/database';

import { FirebaseAppInstance } from '../../firebase/firebase.types';
import { FirebaseDatabasePath } from '../../firebase/firebase.constants';
import { MaybeType } from '../../common/common.types';
import { FirebaseService } from '../../firebase/firebase.service';
import { ChatMessageDto } from '../dto/chat/chat-message.dto';
import { PUBSUB_PROVIDER } from '../../graphql-pubsub/graphql-pubsub.constants';
import { Identity } from '../../auth/auth.types';
import { ChatsArgs } from '../dto/chats/chats.args';
import { ChatListDto } from '../dto/chats/chat-list.dto';
import { ChatDto } from '../dto/chat/chat.dto';
import { SeenByAdminUpdatedDto } from '../dto/subscriptions/seen-by-admin-updated.dto';
import { ChatMemberAdditionArgs } from '../dto/editing/chat-member-addition.args';
import { filterChats } from '../chat.utils/filter-chats.util';
import { CHAT_SEEN_BY_ADMIN_UPDATED_SUBSCRIPTION } from '../chat.constants';
import { ChatsOrderColumn } from '../dto/chats/chats-order-column.enum';
import { ChatInviteAdminArgs } from '../dto/editing/chat-invite-admin.args';
import { ChatMemberDB, ChatsSorterContext } from '../chat.types';
import { SorterService } from 'src/modules/sorter/sorter.service';
import { AppPlatform } from 'src/app.types';
import {
  paginate,
  preparePaginatedResult,
} from 'src/modules/common/common.utils';
import { ChatCreationArgs } from '../dto/creation/chat-creation.args';

@Injectable()
export class ChatService {
  constructor(
    private firebaseService: FirebaseService,
    private chatsSorter: SorterService<
      ChatsOrderColumn,
      ChatDto,
      ChatsSorterContext
    >,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  async getChats(
    args: ChatsArgs,
    identity: Identity,
    platform: AppPlatform | null,
  ): Promise<ChatListDto> {
    const { limit, offset, filter, ordersBy = [] } = args;

    const database = getAdminDatabase(this.firebaseService.getDefaultApp());
    const chatsSnapshot = await database
      .ref(FirebaseDatabasePath.CHATS)
      .once('value');

    let nodes: ChatDto[] = [];

    chatsSnapshot.forEach((snapshot) => {
      if (!snapshot.key) {
        return;
      }

      const chat: ChatDB = snapshot.val();

      nodes.push(ChatDto.adapter.toExternal({ ...chat, id: snapshot.key }));
    });

    nodes = filterChats({ identity, filter, chats: nodes, platform });
    nodes = this.chatsSorter.sort(nodes, ordersBy, {
      identity,
    });

    const total = nodes.length;
    nodes = paginate({ nodes, offset, limit });

    return preparePaginatedResult({
      nodes,
      total,
      limit,
      offset,
    });
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

    return ChatDto.adapter.toExternal({ ...chat, id: chatId });
  }

  async getChat(
    chatId: string,
    app: FirebaseAppInstance,
  ): Promise<ChatDto | null> {
    const database = getDatabase(app);

    const path = [FirebaseDatabasePath.CHATS, chatId];
    const chatSnapshot = await get(ref(database, path.join('/')));

    const chat: ChatDB | null = chatSnapshot.val();

    return chat && ChatDto.adapter.toExternal({ ...chat, id: chatId });
  }

  async getUnseenAdminChatsCount(): Promise<number> {
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

  async getUnseenChatsCount(identity: Identity): Promise<number> {
    const database = getAdminDatabase(this.firebaseService.getDefaultApp());

    const chatsSnapshot = await database.ref(FirebaseDatabasePath.CHATS).get();

    let unseenChatsCount = 0;

    chatsSnapshot.forEach((snapshot) => {
      if (!snapshot.key) {
        return;
      }

      const chat = ChatDto.adapter.toExternal({
        ...snapshot.val(),
        id: snapshot.key,
      });

      const member = chat.members.find((member) => member.id === identity.id);

      if (!member) {
        return;
      }

      if (!chat.lastMessageDate) {
        return;
      }

      if (!member.lastOpened) {
        unseenChatsCount++;
        return;
      }

      const lastOpenedDate = +member.lastOpened;
      const lastMessageDate = +chat.lastMessageDate;

      if (lastMessageDate > lastOpenedDate) {
        unseenChatsCount++;
      }
    });

    return unseenChatsCount;
  }

  async createChat(
    args: ChatCreationArgs,
    identity: Identity,
    app: FirebaseAppInstance,
  ): Promise<ChatDto> {
    const { offerRequestId, role } = args;

    const database = this.firebaseService.getDefaultApp().database();
    const chatsRef = database.ref(FirebaseDatabasePath.CHATS);

    const chat: ChatDB = {
      data: {
        members: {
          [identity.id]: {
            role,
          },
        },
        initial: {
          createdAt: Date.now(),
          offerRequest: offerRequestId,
        },
      },
    };

    const ref = await chatsRef.push(chat);

    return this.getChatById(ref.key || '', app);
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

    const chatMember: ChatMemberDB = {
      role,
    };

    await set(ref(database, path.join('/')), chatMember);

    return true;
  }

  async checkIsMember(identity: Identity, chatId: string): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const chatMemberSnapshot = await database
      .ref(FirebaseDatabasePath.CHATS)
      .child(chatId)
      .child('data')
      .child('members')
      .child(identity.id)
      .once('value');

    const chatMember: ChatMemberDB | null = chatMemberSnapshot.val();

    return Boolean(chatMember);
  }

  async attachChatMessageToChat(
    chatId: string,
    chatMessage: ChatMessageDto,
    identity: Identity,
  ) {
    const database = getAdminDatabase(this.firebaseService.getDefaultApp());
    const chatRef = database.ref(FirebaseDatabasePath.CHATS).child(chatId);

    await chatRef
      .child('data')
      .child('messages')
      .child(chatMessage.id)
      .set(true);

    const chatMemberUpdates: Partial<ChatMemberDB> = {
      lastMessageDate: +chatMessage.createdAt,
      lastOpened: +chatMessage.createdAt,
    };

    await chatRef
      .child('data')
      .child('members')
      .child(identity.id)
      .update(chatMemberUpdates);
  }

  async updateLastOpenedTime(chatId: string, identity: Identity) {
    const app = this.firebaseService.getDefaultApp();

    await app
      .database()
      .ref(FirebaseDatabasePath.CHATS)
      .child(chatId)
      .child('data')
      .child('members')
      .child(identity.id)
      .child('lastOpened')
      .set(Date.now());
  }

  async inviteAdmin(args: ChatInviteAdminArgs) {
    const { chatId, isAboutReclamation, isReasonGiven } = args;

    const database = this.firebaseService.getDefaultApp().database();

    const values: Pick<
      ChatDB['data'],
      'inviteAdmin' | 'isAboutReclamation' | 'reasonGiven' | 'seenByAdmin'
    > = {
      inviteAdmin: true,
      seenByAdmin: false,
    };

    if (isAboutReclamation) {
      values.isAboutReclamation = true;
    }

    if (isReasonGiven) {
      values.reasonGiven = true;
    }

    await database
      .ref(FirebaseDatabasePath.CHATS)
      .child(chatId)
      .child('data')
      .update(values);

    const seenByAdminUpdatedDto: SeenByAdminUpdatedDto = {
      previous: true,
      current: false,
      chatId,
    };

    this.pubSub.publish(CHAT_SEEN_BY_ADMIN_UPDATED_SUBSCRIPTION, {
      [CHAT_SEEN_BY_ADMIN_UPDATED_SUBSCRIPTION]: seenByAdminUpdatedDto,
    });
  }
}
