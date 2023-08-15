import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class OfferIdInput {
  @Field()
  offerId: string;
}
