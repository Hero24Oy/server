import { Field, ObjectType } from '@nestjs/graphql';
import { OfferRequestChat } from 'hero24-types';

import { FirebaseAdapter } from '$/src/modules/firebase/firebase.adapter';

@ObjectType()
export class OfferRequestChatDto {
  @Field(() => String)
  sellerProfileId: string;

  @Field(() => String)
  chatId: string;

  static adapter: FirebaseAdapter<OfferRequestChat, OfferRequestChatDto>;
}

OfferRequestChatDto.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    chatId: external.chatId,
    sellerProfile: external.sellerProfileId,
  }),
  toExternal: (internal) => ({
    chatId: internal.chatId,
    sellerProfileId: internal.sellerProfile,
  }),
});
