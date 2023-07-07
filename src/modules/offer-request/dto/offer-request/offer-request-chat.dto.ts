import { Field, ObjectType } from '@nestjs/graphql';
import { OfferRequestChat } from 'hero24-types';

import { FirebaseAdapter } from 'src/modules/firebase/firebase-adapter.interfaces';

@ObjectType()
export class OfferRequestChatDto {
  @Field(() => String)
  sellerId: string;

  @Field(() => String)
  chatId: string;

  static adapter: FirebaseAdapter<OfferRequestChat, OfferRequestChatDto>;
}

OfferRequestChatDto.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    chatId: external.chatId,
    sellerProfile: external.sellerId,
  }),
  toExternal: (internal) => ({
    chatId: internal.chatId,
    sellerId: internal.sellerProfile,
  }),
});
