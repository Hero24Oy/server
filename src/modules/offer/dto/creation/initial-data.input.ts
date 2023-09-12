import { Field, InputType, PickType } from '@nestjs/graphql';

import { OfferInitialDataDto } from '../offer/offer-initial-data.dto';

import { PurchaseInput } from './purchase.input';

@InputType()
export class OfferInitialDataInput extends PickType(
  OfferInitialDataDto,
  [
    'agreedStartTime',
    'buyerProfileId',
    'sellerProfileId',
    'pricePerHour',
    'offerRequestId',
  ],
  InputType,
) {
  @Field(() => PurchaseInput)
  purchase: PurchaseInput;
}
