import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ReceiptDto {
  // * money
  @Field(() => Float)
  heroGrossEarnings: number;

  @Field(() => Float)
  heroNetEarnings: number;

  @Field(() => Float)
  heroVatAmount: number;

  @Field(() => Float)
  feeTotal: number;

  @Field(() => Float)
  overallServiceProvidedPrice: number;

  // * fees
  @Field(() => Float)
  serviceProvidedVat: number;

  @Field(() => Float)
  platformFee: number;

  // * others
  @Field(() => Float)
  workedDuration: number;
}
