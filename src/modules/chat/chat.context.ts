import DataLoader from 'dataloader';
import { Injectable } from '@nestjs/common';

import { AppGraphQLContext } from 'src/app.types';

import { GraphQLContextProviderService } from '../graphql-context-manager/graphql-context-manager.interface';
import { ChatMessageService } from './services/chat-message.service';

@Injectable()
export class ChatContext implements GraphQLContextProviderService {
  constructor(private chatMessageService: ChatMessageService) {}

  async createContext(): Promise<Partial<AppGraphQLContext>> {
    return {
      chatMessageLoader: new DataLoader((ids) =>
        this.chatMessageService.getChatMessageByIds(ids),
      ),
    };
  }
}
