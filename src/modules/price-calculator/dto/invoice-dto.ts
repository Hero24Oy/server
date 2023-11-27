import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ReceiptDto {
  // * money
  @Field(() => Float)
  heroGrossEarnings: number;

  @Field(() => Float)
  heroNetEarnings: number;

  @Field(() => Float)
  netFeeCost: number;

  @Field(() => Float)
  grossFeeCost: number;

  @Field(() => Float)
  overallAmount: number;

  // * fees
  @Field(() => Float)
  serviceProvidedVat: number;

  @Field(() => Float)
  platformFee: number;

  // * others
  @Field(() => Float)
  workedDuration: number;
}
