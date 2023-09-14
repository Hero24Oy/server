import { Field, InputType } from '@nestjs/graphql';

import { AddressesAnsweredInput } from '../address-answered/addresses-answered.input';

import { OfferRequestIdInput } from '$modules/offer/dto/editing/offer-request-id.input';

@InputType()
export class OfferRequestUpdateAddressesInput extends OfferRequestIdInput {
  @Field(() => AddressesAnsweredInput)
  addresses: AddressesAnsweredInput;
}
