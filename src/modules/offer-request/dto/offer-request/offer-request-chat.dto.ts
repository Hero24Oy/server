import { Field, ObjectType } from '@nestjs/graphql';
import { OfferRequestChat } from 'hero24-types';

import { TypeSafeRequired } from 'src/modules/common/common.types';
import { FirebaseGraphQLAdapter } from 'src/modules/firebase/firebase.interfaces';

type OfferRequestChatShape = {
  sellerId: string;
  chatId: string;
};

@ObjectType()
export class OfferRequestChatDto
  extends FirebaseGraphQLAdapter<OfferRequestChatShape, OfferRequestChat>
  implements OfferRequestChatShape
{
  @Field(() => String)
  sellerId: string;

  @Field(() => String)
  chatId: string;

  protected toFirebaseType(): TypeSafeRequired<OfferRequestChat> {
    return {
      chatId: this.chatId,
      sellerProfile: this.sellerId,
    };
  }

  protected fromFirebaseType(
    chat: OfferRequestChat,
  ): TypeSafeRequired<OfferRequestChatShape> {
    return {
      chatId: chat.chatId,
      sellerId: chat.sellerProfile,
    };
  }
}
