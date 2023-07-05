import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import map from 'lodash/map';

import { FirebaseApp } from 'src/modules/firebase/firebase.decorator';
import { Identity } from 'src/modules/auth/auth.types';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { FirebaseAppInstance } from 'src/modules/firebase/firebase.types';
import { PUBSUB_PROVIDER } from 'src/modules/graphql-pubsub/graphql-pubsub.constants';

import { ChatMessageDto } from '../dto/chat/chat-message.dto';
import { ChatMessageCreationArgs } from '../dto/creation/chat-message-creation.args';
import { ChatService } from '../services/chat.service';
import { ChatMessageService } from '../services/chat-message.service';
import { ChatGuard } from '../chat.guard';
import { ChatActivator } from '../chat.activator';
import { IsChatMember } from '../activators/chat-member.activator';
import { UNSEEN_CHATS_CHANGED_SUBSCRIPTION } from '../chat.constants';
import { UnseenChatsChangedDto } from '../dto/subscriptions/unseen-chats-updated-dto';
import { hasMemberSeenChat } from '../chat.utils/has-member-seen-chat.util';
import { AppIdentity } from 'src/modules/auth/auth.decorator';

@Resolver()
export class ChatMessageResolver {
  constructor(
    private chatService: ChatService,
    private chatMessageService: ChatMessageService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  @Mutation(() => ChatMessageDto)
  @ChatActivator<ChatMessageCreationArgs>(IsChatMember('chatId'))
  @UseGuards(AuthGuard, ChatGuard)
  async createChatMessage(
    @Args() args: ChatMessageCreationArgs,
    @FirebaseApp() app: FirebaseAppInstance,
    @AppIdentity() identity: Identity,
  ): Promise<ChatMessageDto> {
    const chatSnapshot = await this.chatService.getChatById(args.chatId, app);

    const chatMessage = await this.chatMessageService.createChatMessage(
      args,
      identity,
    );

    await this.chatService.attachChatMessageToChat(
      args.chatId,
      chatMessage,
      identity,
    );

    await this.chatService.updateLastOpenedTime(args.chatId, identity);

    const seenMembers = chatSnapshot.members.filter(
      (member) =>
        member.id !== identity.id && hasMemberSeenChat(member.id, chatSnapshot),
    );

    const payload: UnseenChatsChangedDto = {
      userIds: map(seenMembers, 'id'),
      delta: 1,
    };

    this.pubSub.publish(UNSEEN_CHATS_CHANGED_SUBSCRIPTION, {
      [UNSEEN_CHATS_CHANGED_SUBSCRIPTION]: payload,
    });

    return chatMessage;
  }
}
