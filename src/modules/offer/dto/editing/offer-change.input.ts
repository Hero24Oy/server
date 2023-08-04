import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class OfferChangeInput {
  @Field(() => Int, { nullable: true })
  agreedStartTime?: number;
}
