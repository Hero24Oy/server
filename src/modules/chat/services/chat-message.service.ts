import { Injectable } from '@nestjs/common';
import { ChatMessageDB } from 'hero24-types';

import { FirebaseDatabasePath } from '../../firebase/firebase.constants';
import { FirebaseService } from '../../firebase/firebase.service';
import { ChatMessageDto } from '../dto/chat/chat-message.dto';
import { ChatMessageCreationArgs } from '../dto/creation/chat-message-creation.args';
import { ChatMessageMirror } from '../mirrors/chat-message.mirror';

import { FirebaseTableReference } from '$/modules/firebase/firebase.types';
import { Identity } from '$modules/auth/auth.types';
import { convertListToFirebaseMap } from '$modules/common/common.utils';

@Injectable()
export class ChatMessageService {
  private readonly chatMessageTableRef: FirebaseTableReference<ChatMessageDB>;

  constructor(
    private readonly chatMessageMirror: ChatMessageMirror,
    firebaseService: FirebaseService,
  ) {
    const database = firebaseService.getDefaultApp().database();

    this.chatMessageTableRef = database.ref(FirebaseDatabasePath.CHAT_MESSAGES);
  }

  async getChatMessageById(
    chatMessageId: string,
  ): Promise<ChatMessageDto | null> {
    const snapshot = await this.chatMessageTableRef.child(chatMessageId).get();

    const chatMessage = snapshot.val();

    return (
      chatMessage &&
      ChatMessageDto.adapter.toExternal({ ...chatMessage, id: chatMessageId })
    );
  }

  async strictGetChatMessageById(
    chatMessageId: string,
  ): Promise<ChatMessageDto> {
    const chatMessage = await this.getChatMessageById(chatMessageId);

    if (!chatMessage) {
      throw new Error('Chat message is not found');
    }

    return chatMessage;
  }

  async getAllChatMessages(): Promise<ChatMessageDto[]> {
    return this.chatMessageMirror
      .getAll()
      .map(([id, chatMessage]) =>
        ChatMessageDto.adapter.toExternal({ id, ...chatMessage }),
      );
  }

  async getChatMessageByIds(
    messageIds: readonly string[],
  ): Promise<(ChatMessageDto | null)[]> {
    const allChatMessages = await this.getAllChatMessages();

    const chatMessages = Object.fromEntries(
      allChatMessages.map((chatMessage) => [chatMessage.id, chatMessage]),
    );

    return messageIds.map((id) => chatMessages[id] || null);
  }

  async createChatMessage(
    args: ChatMessageCreationArgs,
    identity: Identity,
  ): Promise<ChatMessageDto> {
    const { chatId, content, imageIds, location } = args;

    const newMessageRef = await this.chatMessageTableRef.push({
      data: {
        initial: {
          chat: chatId,
          content,
          createdAt: Date.now(),
          sender: identity.id,
          images: convertListToFirebaseMap(imageIds || []),
          imageCount: imageIds?.length || 0,
          ...(location ? { location } : {}),
        },
      },
    });

    if (!newMessageRef.key) {
      throw new Error('Chat message cant be created');
    }

    return this.strictGetChatMessageById(newMessageRef.key);
  }
}
