import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class PurchaseInput {
  @Field(() => Float)
  pricePerHour: number;

  @Field(() => Float)
  duration: number;

  // set by server
  readonly createdAt: number;
}
