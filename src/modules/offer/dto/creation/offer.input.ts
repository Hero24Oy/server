import { Field, InputType } from '@nestjs/graphql';
import { OfferDataInput } from './offer-data.input';

@InputType()
export class OfferInput {
  @Field(() => OfferDataInput)
  data: OfferDataInput;

  // set by server
  readonly status: 'open';
}
