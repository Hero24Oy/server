import { Field, InputType } from '@nestjs/graphql';
import { OfferRequestIdInput } from 'src/modules/offer/dto/editing/offer-request-id.input';

import { AddressesAnsweredInput } from '../address-answered/addresses-answered.input';

@InputType()
export class OfferRequestUpdateAddressesInput extends OfferRequestIdInput {
  @Field(() => AddressesAnsweredInput)
  addresses: AddressesAnsweredInput;
}
