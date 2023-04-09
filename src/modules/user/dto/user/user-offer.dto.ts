import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserOfferDto {
  @Field(() => String)
  offerId: string;

  @Field(() => String)
  offerRequestId: string;
}
