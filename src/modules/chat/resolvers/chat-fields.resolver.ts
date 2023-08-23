import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { isNotNull } from 'src/modules/common/common.utils';

import { ChatDto } from '../dto/chat/chat.dto';
import { ChatMessageDto } from '../dto/chat/chat-message.dto';
import { ChatMessageService } from '../services/chat-message.service';
import { OfferRequestService } from 'src/modules/offer-request/offer-request.service';
import { MaybeType } from 'src/modules/common/common.types';

@Resolver(() => ChatDto)
export class ChatFieldsResolver {
  constructor(
    private chatMessageService: ChatMessageService,
    private offerRequestService: OfferRequestService,
  ) {}

  @ResolveField(() => [ChatMessageDto], { name: 'messages' })
  async chatMessages(@Parent() parent: ChatDto) {
    const chatMessages = await this.chatMessageService.getChatMessageByIds(
      parent.messageIds,
    );

    return chatMessages.filter(isNotNull);
  }

  @ResolveField(() => String, { nullable: true })
  async categoryId(@Parent() parent: ChatDto): Promise<MaybeType<string>> {
    const { offerRequestId } = parent;

    if (!offerRequestId) {
      return null;
    }

    return this.offerRequestService.getCategoryIdByOfferRequestId(
      offerRequestId,
    );
  }
}
