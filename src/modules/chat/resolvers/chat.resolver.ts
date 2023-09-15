import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { Identity } from '../../auth/auth.types';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { FirebaseApp } from '../../firebase/firebase.decorator';
import { FirebaseAppInstance } from '../../firebase/firebase.types';
import { PUBSUB_PROVIDER } from '../../graphql-pubsub/graphql-pubsub.constants';
import { IsChatMember } from '../activators/chat-member.activator';
import { ChatActivator } from '../chat.activator';
import {
  CHAT_ADDED_SUBSCRIPTION,
  CHAT_SEEN_BY_ADMIN_UPDATED_SUBSCRIPTION,
  CHAT_UPDATED_SUBSCRIPTION,
  UNSEEN_CHATS_CHANGED_SUBSCRIPTION,
} from '../chat.constants';
import { ChatGuard } from '../chat.guard';
import { hasMemberSeenChat } from '../chat.utils/has-member-seen-chat.util';
import { ChatDto } from '../dto/chat/chat.dto';
import { ChatListDto } from '../dto/chats/chat-list.dto';
import { ChatsArgs } from '../dto/chats/chats.args';
import { ChatCreationInput } from '../dto/creation/chat-creation.input';
import { ChatInviteAdminArgs } from '../dto/editing/chat-invite-admin.args';
import { ChatMemberAdditionArgs } from '../dto/editing/chat-member-addition.args';
import { SeenByAdminUpdatedDto } from '../dto/subscriptions/seen-by-admin-updated.dto';
import { UnseenChatsChangedDto } from '../dto/subscriptions/unseen-chats-updated-dto';
import { ChatService } from '../services/chat.service';

import { AppGraphQlContext } from '$/app.types';
import { Scope } from '$modules/auth/auth.constants';
import { AuthIdentity } from '$modules/auth/auth.decorator';

@Resolver()
export class ChatResolver {
  constructor(
    private chatService: ChatService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  @Query(() => ChatListDto)
  @UseGuards(AuthGuard)
  chats(
    @Args() args: ChatsArgs,
    @AuthIdentity() identity: Identity,
  ): Promise<ChatListDto> {
    return this.chatService.getChats(args, identity);
  }

  @Query(() => ChatDto, { nullable: true })
  @ChatActivator<{ id: string }>(IsChatMember('id'))
  @UseGuards(AuthGuard, ChatGuard)
  async chat(
    @Args('id') chatId: string,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<ChatDto | null> {
    return this.chatService.getChat(chatId, app);
  }

  @Query(() => Int)
  @UseGuards(AdminGuard)
  async unseenAdminChatsCount(): Promise<number> {
    return this.chatService.getUnseenAdminChatsCount();
  }

  @Query(() => Int)
  @UseGuards(AuthGuard)
  async unseenChatsCount(@AuthIdentity() identity: Identity): Promise<number> {
    return this.chatService.getUnseenChatsCount(identity);
  }

  @Mutation(() => ChatDto)
  @UseGuards(AuthGuard)
  async createChat(
    @Args('input') input: ChatCreationInput,
    @AuthIdentity() identity: Identity,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<ChatDto> {
    return this.chatService.createChat(input, identity, app);
  }

  @Mutation(() => Boolean)
  @UseGuards(AdminGuard)
  async setChatSeenByAdmin(
    @Args('chatId') chatId: string,
    @Args('seenByAdmin') seenByAdmin: boolean,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<boolean> {
    return this.chatService.setChatSeenByAdmin(chatId, seenByAdmin, app);
  }

  @Mutation(() => Boolean)
  @UseGuards(AdminGuard)
  async setChatReclamationResolved(
    @Args('chatId') chatId: string,
    @Args('isAboutReclamation') isAboutReclamation: boolean,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<boolean> {
    return this.chatService.setChatReclamationResolved(
      chatId,
      isAboutReclamation,
      app,
    );
  }

  @Mutation(() => Boolean)
  @ChatActivator<ChatInviteAdminArgs>(IsChatMember('chatId'))
  @UseGuards(AuthGuard, ChatGuard)
  async inviteAdminToChat(@Args() args: ChatInviteAdminArgs) {
    await this.chatService.inviteAdmin(args);

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(AdminGuard)
  async addMemberToChat(
    @Args() args: ChatMemberAdditionArgs,
  ): Promise<boolean> {
    return this.chatService.addMemberToChat(args);
  }

  @Mutation(() => Boolean)
  @ChatActivator<{ chatId: string }>(IsChatMember('chatId'))
  @UseGuards(AuthGuard, ChatGuard)
  async updateLastOpenedTime(
    @Args('chatId') chatId: string,
    @FirebaseApp() app: FirebaseAppInstance,
    @AuthIdentity() identity: Identity,
  ) {
    const chatSnapshot = await this.chatService.getChatById(chatId, app);

    const isLastMessageExist = Boolean(chatSnapshot.lastMessageDate);
    const isSeenChat = hasMemberSeenChat(identity.id, chatSnapshot);

    await this.chatService.updateLastOpenedTime(chatId, identity);

    if (isLastMessageExist && !isSeenChat) {
      const payload: UnseenChatsChangedDto = {
        userIds: [identity.id],
        delta: -1,
      };

      void this.pubSub.publish(UNSEEN_CHATS_CHANGED_SUBSCRIPTION, {
        [UNSEEN_CHATS_CHANGED_SUBSCRIPTION]: payload,
      });
    }

    return true;
  }

  @Subscription(() => ChatDto, {
    name: CHAT_UPDATED_SUBSCRIPTION,
    filter: (
      payload: { [CHAT_UPDATED_SUBSCRIPTION]: ChatDto },
      { chatIds }: { chatIds?: string[] },
      { identity }: AppGraphQlContext,
    ) => {
      if (!identity) {
        return false;
      }

      const isMember = payload[CHAT_UPDATED_SUBSCRIPTION].members.some(
        (member) => member.id === identity.id,
      );

      const isChatIncluded = chatIds
        ? chatIds.includes(payload[CHAT_UPDATED_SUBSCRIPTION].id)
        : true;

      if (identity.scope === Scope.USER) {
        return isMember && isChatIncluded;
      }

      return isChatIncluded;
    },
  })
  @UseGuards(AuthGuard)
  subscribeOnChatUpdate(
    @Args('chatIds', { type: () => [String], nullable: true })
    _chatIds: string[],
  ) {
    return this.pubSub.asyncIterator(CHAT_UPDATED_SUBSCRIPTION);
  }

  @Subscription(() => ChatDto, {
    name: CHAT_ADDED_SUBSCRIPTION,
    filter: (
      payload: { [CHAT_ADDED_SUBSCRIPTION]: ChatDto },
      _variables,
      context: AppGraphQlContext,
    ) => {
      const { identity } = context;

      if (!identity) {
        return false;
      }

      const chat = payload[CHAT_ADDED_SUBSCRIPTION];

      const { scope, id } = identity;

      if (scope === Scope.ADMIN) {
        return true;
      }

      return chat.members.some((member) => member.id === id);
    },
  })
  @UseGuards(AuthGuard)
  subscribeOnChatAdd() {
    return this.pubSub.asyncIterator(CHAT_ADDED_SUBSCRIPTION);
  }

  @Subscription(() => SeenByAdminUpdatedDto, {
    name: CHAT_SEEN_BY_ADMIN_UPDATED_SUBSCRIPTION,
  })
  @UseGuards(AdminGuard)
  subscribeOnSeenByAdminUpdate() {
    return this.pubSub.asyncIterator(CHAT_SEEN_BY_ADMIN_UPDATED_SUBSCRIPTION);
  }

  @Subscription(() => UnseenChatsChangedDto, {
    name: UNSEEN_CHATS_CHANGED_SUBSCRIPTION,
    filter: (
      payload: { [UNSEEN_CHATS_CHANGED_SUBSCRIPTION]: UnseenChatsChangedDto },
      _variables,
      { identity }: AppGraphQlContext,
    ) => {
      if (!identity) {
        return false;
      }

      return payload[UNSEEN_CHATS_CHANGED_SUBSCRIPTION].userIds.includes(
        identity.id,
      );
    },
  })
  @UseGuards(AuthGuard)
  async subscribeOnUnseenChatsCountChanged() {
    return this.pubSub.asyncIterator(UNSEEN_CHATS_CHANGED_SUBSCRIPTION);
  }
}
