import { Field, InputType, PickType } from '@nestjs/graphql';
import { OfferDB } from 'hero24-types';

import { PurchaseDto } from '../offer/purchase.dto';

import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

type OfferPurchaseDB = Pick<
  OfferDB['data']['initial']['purchase'],
  'duration' | 'pricePerHour'
>;

@InputType()
export class OfferPurchaseInput extends PickType(
  PurchaseDto,
  ['duration', 'pricePerHour'],
  InputType,
) {
  @Field(() => String)
  id: string;

  static adapter: FirebaseAdapter<OfferPurchaseDB, OfferPurchaseInput>;
}

OfferPurchaseInput.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    id: '',
    duration: internal.duration,
    pricePerHour: internal.pricePerHour,
  }),
  toInternal: (external) => ({
    duration: external.duration ?? undefined,
    pricePerHour: external.pricePerHour ?? undefined,
  }),
});
