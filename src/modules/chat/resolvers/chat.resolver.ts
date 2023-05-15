import {
  Args,
  Context,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import { ChatsDto } from '../dto/chats/chats.dto';
import { ChatsArgs } from '../dto/chats/chats.args';
import { ChatService } from '../services/chat.service';
import { ChatDto } from '../dto/chat/chat.dto';
import { FirebaseApp } from '../../firebase/firebase.decorator';
import { FirebaseAppInstance } from '../../firebase/firebase.types';
import { PUBSUB_PROVIDER } from '../../graphql-pubsub/graphql-pubsub.constants';
import {
  CHAT_ADDED_SUBSCRIPTION,
  CHAT_SEEN_BY_ADMIN_UPDATED_SUBSCRIPTION,
  CHAT_UPDATED_SUBSCRIPTION,
} from '../chat.constants';
import { SeenByAdminUpdatedDto } from '../dto/subscriptions/seen-by-admin-updated.dto';
import { ChatMemberAdditionArgs } from '../dto/editing/chat-member-addition.args';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { Identity } from '../../auth/auth.types';

@Resolver()
export class ChatResolver {
  constructor(
    private chatService: ChatService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  @Query(() => ChatsDto)
  @UseGuards(AuthGuard)
  chats(
    @Args() args: ChatsArgs,
    @Context('identity') identity: Identity,
  ): Promise<ChatsDto> {
    return this.chatService.getChats(args, identity);
  }

  @Query(() => ChatDto, { nullable: true })
  @UseGuards(AuthGuard)
  async chat(
    @Args('id') chatId: string,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<ChatDto | null> {
    return this.chatService.getChat(chatId, app);
  }

  @Query(() => Int)
  @UseGuards(AdminGuard)
  async unseenAdminChatsCount(): Promise<number> {
    return this.chatService.getUnseenChatsCount();
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
  @UseGuards(AuthGuard)
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
  @UseGuards(AdminGuard)
  async addMemberToChat(
    @Args() args: ChatMemberAdditionArgs,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<boolean> {
    return this.chatService.addMemberToChat(args, app);
  }

  @Subscription(() => ChatDto, {
    name: CHAT_UPDATED_SUBSCRIPTION,
    filter: (
      payload: { [CHAT_UPDATED_SUBSCRIPTION]: ChatDto },
      { chatIds }: { chatIds: string[] },
    ) => {
      return chatIds.includes(payload[CHAT_UPDATED_SUBSCRIPTION].id);
    },
  })
  @UseGuards(AuthGuard)
  subscribeOnChatUpdate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Args('chatIds', { type: () => [String] }) chatIds: string[],
  ) {
    return this.pubSub.asyncIterator(CHAT_UPDATED_SUBSCRIPTION);
  }

  @Subscription(() => ChatDto, { name: CHAT_ADDED_SUBSCRIPTION })
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
}
