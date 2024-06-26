import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import map from 'lodash/map';

import { IsChatMember } from '../activators/chat-member.activator';
import { ChatActivator } from '../chat.activator';
import { UNSEEN_CHATS_CHANGED_SUBSCRIPTION } from '../chat.constants';
import { ChatGuard } from '../chat.guard';
import { hasMemberSeenChat } from '../chat.utils/has-member-seen-chat.util';
import { ChatMessageDto } from '../dto/chat/chat-message.dto';
import { ChatMessageCreationArgs } from '../dto/creation/chat-message-creation.args';
import { UnseenChatsChangedDto } from '../dto/subscriptions/unseen-chats-updated-dto';
import { ChatService } from '../services/chat.service';
import { ChatMessageService } from '../services/chat-message.service';

import { AuthIdentity } from '$modules/auth/auth.decorator';
import { Identity } from '$modules/auth/auth.types';
import { AuthGuard } from '$modules/auth/guards/auth.guard';
import { FirebaseApp } from '$modules/firebase/firebase.decorator';
import { FirebaseAppInstance } from '$modules/firebase/firebase.types';
import { PUBSUB_PROVIDER } from '$modules/graphql-pubsub/graphql-pubsub.constants';

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
    @AuthIdentity() identity: Identity,
  ): Promise<ChatMessageDto> {
    const chat = await this.chatService.strictGetChatById(args.chatId, app);

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

    const seenMembers = chat.members.filter(
      (member) =>
        member.id !== identity.id && hasMemberSeenChat(member.id, chat),
    );

    const payload: UnseenChatsChangedDto = {
      userIds: map(seenMembers, 'id'),
      delta: 1,
    };

    void this.pubSub.publish(UNSEEN_CHATS_CHANGED_SUBSCRIPTION, {
      [UNSEEN_CHATS_CHANGED_SUBSCRIPTION]: payload,
    });

    return chatMessage;
  }
}
