import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class OfferExtendInput {
  @Field(() => Float)
  extendedDuration: number;

  @Field(() => String)
  reasonToExtend: string;
}
