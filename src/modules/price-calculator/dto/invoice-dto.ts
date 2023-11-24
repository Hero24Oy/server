import { Field, Float, ObjectType } from '@nestjs/graphql';

// TODO better naming
@ObjectType()
export class InvoiceDto {
  @Field(() => Float)
  heroGrossEarnings: number;

  @Field(() => Float)
  heroNetEarnings: number;

  @Field(() => Float)
  heroVatAmount: number;

  @Field(() => Float)
  hero24PlatformCut: number;

  @Field(() => Float)
  overallServicePrice: number;
}
