import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { isNotNull } from 'src/modules/common/common.utils';

import { ChatDto } from '../dto/chat/chat.dto';
import { ChatMessageDto } from '../dto/chat/chat-message.dto';
import { AppGraphQLContext } from 'src/app.types';
import { OfferRequestService } from 'src/modules/offer-request/offer-request.service';
import { MaybeType } from 'src/modules/common/common.types';

@Resolver(() => ChatDto)
export class ChatFieldsResolver {
  constructor(private readonly offerRequestService: OfferRequestService) {}

  @ResolveField(() => [ChatMessageDto])
  async messages(
    @Parent() parent: ChatDto,
    @Context() context: AppGraphQLContext,
  ) {
    const { messageIds } = parent;
    const { chatMessageLoader } = context;

    const chatMessages = await Promise.all(
      messageIds.map((id) => chatMessageLoader.load(id)),
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
