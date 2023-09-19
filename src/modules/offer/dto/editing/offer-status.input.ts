import { Field, InputType } from '@nestjs/graphql';

import { OfferStatus } from '../offer/offer-status.enum';

import { OfferIdInput } from './offer-id.input';

@InputType()
export class OfferStatusInput extends OfferIdInput {
  @Field(() => OfferStatus)
  status: OfferStatus;
}
