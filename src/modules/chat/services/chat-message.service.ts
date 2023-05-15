import { Injectable } from '@nestjs/common';
import { ChatMessageDto } from '../dto/chat/chat-message.dto';
import { getDatabase as getAdminDatabase } from 'firebase-admin/database';
import { FirebaseService } from '../../firebase/firebase.service';
import { FirebaseDatabasePath } from '../../firebase/firebase.constants';
import { ChatMessageDB } from 'hero24-types';
import { ChatMessageCreationArgs } from '../dto/creation/chat-message-creation.args';
import { FirebaseAppInstance } from '../../firebase/firebase.types';
import {
  get,
  getDatabase,
  push,
  ref,
  serverTimestamp,
} from 'firebase/database';

@Injectable()
export class ChatMessageService {
  constructor(private firebaseService: FirebaseService) {}

  async getChatMessageById(
    chatMessageId: string,
    app: FirebaseAppInstance,
  ): Promise<ChatMessageDto | null> {
    const database = getDatabase(app);

    const path = [FirebaseDatabasePath.CHAT_MESSAGES, chatMessageId];
    const snapshot = await get(ref(database, path.join('/')));

    const chatMessage: ChatMessageDB | null = snapshot.val();

    return (
      chatMessage &&
      ChatMessageDto.convertFromFirebaseType(chatMessage, chatMessageId)
    );
  }

  async getChatMessageByIds(
    messageIds: string[],
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
      chatMessages[snapshot.key] = ChatMessageDto.convertFromFirebaseType(
        chatMessage,
        snapshot.key,
      );
    });

    return messageIds.map((id) => chatMessages[id] || null);
  }

  async createChatMessage(
    args: ChatMessageCreationArgs,
    app: FirebaseAppInstance,
    userId: string,
  ): Promise<ChatMessageDto> {
    const { chatId, content } = args;

    const database = getDatabase(app);

    const messagesRef = ref(database, FirebaseDatabasePath.CHAT_MESSAGES);

    const firebaseChatMessage: ChatMessageDB = {
      data: {
        initial: {
          chat: chatId,
          content,
          createdAt: serverTimestamp() as unknown as number,
          sender: userId,
        },
      },
    };

    const newMessageRef = await push(messagesRef, firebaseChatMessage);

    if (!newMessageRef.key) {
      throw new Error('Chat message cant be created');
    }

    const chatMessage = await this.getChatMessageById(newMessageRef.key, app);

    if (!chatMessage) {
      throw new Error(`Cant find the chat message`);
    }

    return chatMessage;
  }
}
