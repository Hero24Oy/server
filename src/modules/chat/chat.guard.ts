import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AppGraphQlContext } from 'src/app.types';

import { CHAT_ACTIVATOR_METADATA_KEY } from './chat.constants';
import { ChatBaseGuardActivator } from './chat.types';
import { ChatService } from './services/chat.service';
import { ChatMessageService } from './services/chat-message.service';

@Injectable()
export class ChatGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private chatService: ChatService,
    private chatMessageService: ChatMessageService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const graphQlExecutionContext = GqlExecutionContext.create(context);

    const args = graphQlExecutionContext.getArgs();

    const appGraphQlContext =
      graphQlExecutionContext.getContext<AppGraphQlContext>();

    const chatActivators: ChatBaseGuardActivator[] = this.reflector.get(
      CHAT_ACTIVATOR_METADATA_KEY,
      context.getHandler(),
    );

    const canActivates = await Promise.all(
      chatActivators.map((chatActivator) =>
        chatActivator(args, appGraphQlContext, {
          chatMessageService: this.chatMessageService,
          chatService: this.chatService,
        }),
      ),
    );

    return canActivates.every((canActivate) => canActivate);
  }
}
