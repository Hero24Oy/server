import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OfferRequestChatDto {
  @Field(() => String)
  sellerId: string;

  @Field(() => String)
  chatId: string;
}
