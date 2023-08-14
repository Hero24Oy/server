import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AcceptanceGuardInput {
  @Field()
  offerRequestId: string;

  @Field()
  sellerProfileId: string;
}
