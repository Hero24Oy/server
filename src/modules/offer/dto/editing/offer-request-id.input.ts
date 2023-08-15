import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class OfferRequestIdInput {
  @Field()
  offerRequestId: string;
}
