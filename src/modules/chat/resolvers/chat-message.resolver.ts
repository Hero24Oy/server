import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { FirebaseApp } from 'src/modules/firebase/firebase.decorator';
import { Identity } from 'src/modules/auth/auth.types';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { FirebaseAppInstance } from 'src/modules/firebase/firebase.types';

import { ChatMessageDto } from '../dto/chat/chat-message.dto';
import { ChatMessageCreationArgs } from '../dto/creation/chat-message-creation.args';
import { ChatService } from '../services/chat.service';
import { ChatMessageService } from '../services/chat-message.service';

@Resolver()
export class ChatMessageResolver {
  constructor(
    private chatService: ChatService,
    private chatMessageService: ChatMessageService,
  ) {}

  @Mutation(() => ChatMessageDto)
  @UseGuards(AuthGuard)
  async createChatMessage(
    @Args() args: ChatMessageCreationArgs,
    @FirebaseApp() app: FirebaseAppInstance,
    @Context('identity') identity: Identity,
  ): Promise<ChatMessageDto> {
    await this.chatService.checkMessageCreationRights(
      identity,
      args.chatId,
      app,
    );

    const chatMessage = await this.chatMessageService.createChatMessage(
      args,
      app,
      identity.id,
    );

    await this.chatService.attachChatMessageToChat(
      args.chatId,
      chatMessage,
      app,
    );

    return chatMessage;
  }
}
