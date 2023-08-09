import { Field, InputType } from '@nestjs/graphql';

import { OfferStatus } from '../offer/offer-status.enum';

@InputType()
export class OfferStatusInput {
  @Field(() => OfferStatus)
  status: OfferStatus;
}
