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
  discountAmount: number;

  @Field(() => Float)
  overallAmount: number;

  @Field(() => Float)
  pricePerHourWithVat: number;

  @Field(() => Float)
  pricePerHourWithoutVat: number;

  // * taxes
  @Field(() => Float)
  serviceProvidedVat: number;

  @Field(() => Float)
  customerVat: number;

  @Field(() => Float)
  platformFee: number;

  // * time
  @Field(() => Float)
  workedDurationInH: number;

  @Field(() => Float)
  purchasedDurationInH: number;

  @Field(() => Float)
  minimumDurationInH: number;

  // * actualDuration is calculated using workedDuration, purchasedDuration, minimumDuration
  @Field(() => Float)
  actualDurationInH: number;
}
