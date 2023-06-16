import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { AppGraphQLContext } from 'src/app.types';

import { ChatService } from './services/chat.service';
import { ChatBaseGuardActivator } from './chat.types';
import { CHAT_ACTIVATOR_METADATA_KEY } from './chat.constants';
import { ChatMessageService } from './services/chat-message.service';

@Injectable()
export class ChatGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private chatService: ChatService,
    private chatMessageService: ChatMessageService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const graphQLExecutionContext = GqlExecutionContext.create(context);

    const args = graphQLExecutionContext.getArgs();
    const appGraphQLContext =
      graphQLExecutionContext.getContext<AppGraphQLContext>();

    const chatActivators: ChatBaseGuardActivator[] = this.reflector.get(
      CHAT_ACTIVATOR_METADATA_KEY,
      context.getHandler(),
    );

    const canActivates = await Promise.all(
      chatActivators.map((chatActivator) =>
        chatActivator(args, appGraphQLContext, {
          chatMessageService: this.chatMessageService,
          chatService: this.chatService,
        }),
      ),
    );

    return canActivates.every((canActivate) => canActivate);
  }
}
