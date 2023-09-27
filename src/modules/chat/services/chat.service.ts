import { Inject, Injectable } from '@nestjs/common';
import { get, getDatabase, ref, set } from 'firebase/database';
import { PubSub } from 'graphql-subscriptions';
import { ChatDB } from 'hero24-types';

import { Identity } from '../../auth/auth.types';
import { FirebaseDatabasePath } from '../../firebase/firebase.constants';
import { FirebaseService } from '../../firebase/firebase.service';
import {
  FirebaseAppInstance,
  FirebaseTableReference,
} from '../../firebase/firebase.types';
import { PUBSUB_PROVIDER } from '../../graphql-pubsub/graphql-pubsub.constants';
import { CHAT_SEEN_BY_ADMIN_UPDATED_SUBSCRIPTION } from '../chat.constants';
import { ChatsSorterContext } from '../chat.types';
import { filterChats } from '../chat.utils/filter-chats.util';
import { ChatDto } from '../dto/chat/chat.dto';
import { ChatMemberDB } from '../dto/chat/chat-member.dto';
import { ChatMessageDto } from '../dto/chat/chat-message.dto';
import { ChatListDto } from '../dto/chats/chat-list.dto';
import { ChatsArgs } from '../dto/chats/chats.args';
import { ChatsOrderColumn } from '../dto/chats/chats-order-column.enum';
import { ChatCreationInput } from '../dto/creation/chat-creation.input';
import { ChatInviteAdminArgs } from '../dto/editing/chat-invite-admin.args';
import { ChatMemberAdditionArgs } from '../dto/editing/chat-member-addition.args';
import { SeenByAdminUpdatedDto } from '../dto/subscriptions/seen-by-admin-updated.dto';
import { ChatMirror } from '../mirrors/chat.mirror';

import { paginate, preparePaginatedResult } from '$modules/common/common.utils';
import { SorterService } from '$modules/sorter/sorter.service';

@Injectable()
export class ChatService {
  readonly chatTableRef: FirebaseTableReference<ChatDB>;

  constructor(
    private chatsSorter: SorterService<
      ChatsOrderColumn,
      ChatDto,
      ChatsSorterContext
    >,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
    private readonly chatMirror: ChatMirror,
    firebaseService: FirebaseService,
  ) {
    const database = firebaseService.getDefaultApp().database();

    this.chatTableRef = database.ref(FirebaseDatabasePath.CHATS);
  }

  async getAllChats(): Promise<ChatDto[]> {
    return this.chatMirror
      .getAll()
      .map(([id, chat]) => ChatDto.adapter.toExternal({ id, ...chat }));
  }

  async getChats(args: ChatsArgs, identity: Identity): Promise<ChatListDto> {
    const { limit, offset, filter, ordersBy = [] } = args;

    let nodes = await this.getAllChats();

    nodes = filterChats({ identity, filter, chats: nodes });
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

  async strictGetChatById(
    chatId: string,
    app: FirebaseAppInstance,
  ): Promise<ChatDto> {
    const chat = await this.getChatById(chatId, app);

    if (!chat) {
      throw new Error("Chat isn't existed");
    }

    return chat;
  }

  async getChatById(
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
    const chats = await this.getAllChats();

    return chats.reduce((unseenChatsCount, chat) => {
      if (chat.inviteAdmin && !chat.seenByAdmin) {
        return unseenChatsCount + 1;
      }

      return unseenChatsCount;
    }, 0);
  }

  async getUnseenChatsCount(identity: Identity): Promise<number> {
    const chats = await this.getAllChats();

    return chats.reduce((unseenChatsCount, chat) => {
      const chatMember = chat.members.find(
        (member) => member.id === identity.id,
      );

      if (!chatMember || !chat.lastMessageDate) {
        return unseenChatsCount;
      }

      if (!chatMember.lastOpened) {
        return unseenChatsCount + 1;
      }

      const lastOpenedDate = +chatMember.lastOpened;
      const lastMessageDate = +chat.lastMessageDate;

      if (lastMessageDate > lastOpenedDate) {
        return unseenChatsCount + 1;
      }

      return unseenChatsCount;
    }, 0);
  }

  async createChat(
    input: ChatCreationInput,
    identity: Identity,
    app: FirebaseAppInstance,
  ): Promise<ChatDto> {
    const { offerRequestId, role } = input;

    const chatRef = await this.chatTableRef.push({
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
    });

    if (!chatRef.key) {
      throw new Error("Chats can't be created");
    }

    return this.strictGetChatById(chatRef.key, app);
  }

  async setChatSeenByAdmin(
    chatId: string,
    seenByAdmin: boolean,
    app: FirebaseAppInstance,
  ): Promise<boolean> {
    const database = getDatabase(app);
    const path = [FirebaseDatabasePath.CHATS, chatId, 'data', 'seenByAdmin'];
    const seenByAdminRef = ref(database, path.join('/'));

    const snapshot = await get(seenByAdminRef);

    const isPreviousSeenByAdmin: boolean | null = snapshot.val();

    await set(seenByAdminRef, seenByAdmin);

    const seenByAdminUpdatedDto: SeenByAdminUpdatedDto = {
      previous: isPreviousSeenByAdmin,
      current: seenByAdmin,
      chatId,
    };

    void this.pubSub.publish(CHAT_SEEN_BY_ADMIN_UPDATED_SUBSCRIPTION, {
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

  async addMemberToChat(args: ChatMemberAdditionArgs): Promise<boolean> {
    const { userId, chatId, role } = args;

    await this.chatTableRef
      .child(chatId)
      .child('data')
      .child('members')
      .child(userId)
      .set({ role });

    return true;
  }

  async checkIsMember(identity: Identity, chatId: string): Promise<boolean> {
    const chatMemberSnapshot = await this.chatTableRef
      .child(chatId)
      .child('data')
      .child('members')
      .child(identity.id)
      .get();

    const chatMember = chatMemberSnapshot.val();

    return Boolean(chatMember);
  }

  async attachChatMessageToChat(
    chatId: string,
    chatMessage: ChatMessageDto,
    identity: Identity,
  ): Promise<void> {
    const chatRef = this.chatTableRef.child(chatId);

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

  async updateLastOpenedTime(
    chatId: string,
    identity: Identity,
  ): Promise<void> {
    await this.chatTableRef
      .child(chatId)
      .child('data')
      .child('members')
      .child(identity.id)
      .child('lastOpened')
      .set(Date.now());
  }

  async inviteAdmin(args: ChatInviteAdminArgs): Promise<void> {
    const { chatId, isAboutReclamation, isReasonGiven } = args;

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

    await this.chatTableRef.child(chatId).child('data').update(values);

    const seenByAdminUpdatedDto: SeenByAdminUpdatedDto = {
      previous: true,
      current: false,
      chatId,
    };

    void this.pubSub.publish(CHAT_SEEN_BY_ADMIN_UPDATED_SUBSCRIPTION, {
      [CHAT_SEEN_BY_ADMIN_UPDATED_SUBSCRIPTION]: seenByAdminUpdatedDto,
    });
  }
}
