import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { ChatDto } from '../dto/chat/chat.dto';
import { ChatMessageDto } from '../dto/chat/chat-message.dto';

import { AppGraphQlContext } from '$/app.types';
import { MaybeType } from '$modules/common/common.types';
import { isNotNull } from '$modules/common/common.utils';
import { OfferRequestService } from '$modules/offer-request/offer-request.service';

@Resolver(() => ChatDto)
export class ChatFieldsResolver {
  constructor(private readonly offerRequestService: OfferRequestService) {}

  @ResolveField(() => [ChatMessageDto])
  async messages(
    @Parent() parent: ChatDto,
    @Context() context: AppGraphQlContext,
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
