import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';

import { GraphQlContextProviderService } from '../graphql-context-manager/graphql-context-manager.interface';

import { ChatMessageService } from './services/chat-message.service';

import { AppGraphQlContext } from '$/app.types';

@Injectable()
export class ChatContext implements GraphQlContextProviderService {
  constructor(private chatMessageService: ChatMessageService) {}

  async createContext(): Promise<Partial<AppGraphQlContext>> {
    return {
      chatMessageLoader: new DataLoader((ids) =>
        this.chatMessageService.getChatMessageByIds(ids),
      ),
    };
  }
}
