import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class OfferRequestIdInput {
  @Field(() => String)
  offerRequestId: string;
}
