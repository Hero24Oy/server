import { Field, InputType, PickType } from '@nestjs/graphql';
import { OfferRequestDB } from 'hero24-types';

import { OfferRequestDataInitialDto } from '../offer-request/offer-request-data-initial.dto';

import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

type OfferRequestPurchaseDB = Pick<
  OfferRequestDB['data']['initial'],
  'fixedPrice' | 'fixedDuration'
>;

@InputType()
export class OfferRequestPurchaseInput extends PickType(
  OfferRequestDataInitialDto,
  ['fixedDuration', 'fixedPrice'],
  InputType,
) {
  @Field(() => String)
  id: string;

  static adapter: FirebaseAdapter<
    OfferRequestPurchaseDB,
    OfferRequestPurchaseInput
  >;
}

OfferRequestPurchaseInput.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    id: '',
    fixedDuration: internal.fixedDuration,
    fixedPrice: internal.fixedPrice,
  }),
  toInternal: (external) => ({
    fixedDuration: external.fixedDuration ?? undefined,
    fixedPrice: external.fixedPrice ?? undefined,
  }),
});
