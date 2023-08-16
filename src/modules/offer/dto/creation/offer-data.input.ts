import { Field, InputType } from '@nestjs/graphql';

import { OfferInitialDataInput } from './initial-data.input';

@InputType()
export class OfferDataInput {
  @Field(() => OfferInitialDataInput)
  initial: OfferInitialDataInput;
}
