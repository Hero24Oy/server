import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { isNotNull } from 'src/modules/common/common.utils';

import { ChatDto } from '../dto/chat/chat.dto';
import { ChatMessageDto } from '../dto/chat/chat-message.dto';
import { ChatMessageService } from '../services/chat-message.service';

@Resolver(() => ChatDto)
export class ChatFieldsResolver {
  constructor(private chatMessageService: ChatMessageService) {}

  @ResolveField(() => [ChatMessageDto], { name: 'messages' })
  async chatMessages(@Parent() parent: ChatDto) {
    const chatMessages = await this.chatMessageService.getChatMessageByIds(
      parent.messageIds,
    );

    return chatMessages.filter(isNotNull);
  }
}
