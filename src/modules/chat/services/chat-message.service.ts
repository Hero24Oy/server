import { ChatMessageDB } from 'hero24-types';
import { Injectable } from '@nestjs/common';
import { getDatabase as getAdminDatabase } from 'firebase-admin/database';

import { ChatMessageDto } from '../dto/chat/chat-message.dto';
import { FirebaseService } from '../../firebase/firebase.service';
import { FirebaseDatabasePath } from '../../firebase/firebase.constants';
import { ChatMessageCreationArgs } from '../dto/creation/chat-message-creation.args';
import { convertListToFirebaseMap } from 'src/modules/common/common.utils';
import { Identity } from 'src/modules/auth/auth.types';

@Injectable()
export class ChatMessageService {
  constructor(private firebaseService: FirebaseService) {}

  async getChatMessageById(
    chatMessageId: string,
  ): Promise<ChatMessageDto | null> {
    const database = getAdminDatabase(this.firebaseService.getDefaultApp());

    const snapshot = await database
      .ref(FirebaseDatabasePath.CHAT_MESSAGES)
      .child(chatMessageId)
      .get();

    const chatMessage: ChatMessageDB | null = snapshot.val();

    return (
      chatMessage &&
      ChatMessageDto.adapter.toExternal({ ...chatMessage, id: chatMessageId })
    );
  }

  async getChatMessageByIds(
    messageIds: readonly string[],
  ): Promise<(ChatMessageDto | null)[]> {
    const database = getAdminDatabase(this.firebaseService.getDefaultApp());

    const chatMessagesSnapshot = await database
      .ref(FirebaseDatabasePath.CHAT_MESSAGES)
      .once('value');

    const chatMessages: Record<string, ChatMessageDto> = {};

    chatMessagesSnapshot.forEach((snapshot) => {
      if (!snapshot.key) {
        return;
      }

      const chatMessage: ChatMessageDB = snapshot.val();

      chatMessages[snapshot.key] = ChatMessageDto.adapter.toExternal({
        ...chatMessage,
        id: snapshot.key,
      });
    });

    return messageIds.map((id) => chatMessages[id] || null);
  }

  async createChatMessage(
    args: ChatMessageCreationArgs,
    identity: Identity,
  ): Promise<ChatMessageDto> {
    const { chatId, content, imageIds, location } = args;

    const database = getAdminDatabase(this.firebaseService.getDefaultApp());

    const messagesRef = database.ref(FirebaseDatabasePath.CHAT_MESSAGES);

    const firebaseChatMessage: ChatMessageDB = {
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
    };

    const newMessageRef = await messagesRef.push(firebaseChatMessage);

    if (!newMessageRef.key) {
      throw new Error('Chat message cant be created');
    }

    const chatMessage = await this.getChatMessageById(newMessageRef.key);

    if (!chatMessage) {
      throw new Error(`Cant find the chat message`);
    }

    return chatMessage;
  }
}
