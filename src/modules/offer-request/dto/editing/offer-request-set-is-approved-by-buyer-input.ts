import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class OfferRequestSetIsApprovedByBuyerInput {
  @Field(() => Boolean)
  isApprovedByBuyer: boolean;

  @Field(() => String)
  id: string;
}
