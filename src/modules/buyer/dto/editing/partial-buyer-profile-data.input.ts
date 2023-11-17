import { InputType, PartialType } from '@nestjs/graphql';
import { BuyerProfileDB } from 'hero24-types';

import {
  BuyerProfileDataDto,
  CustomerType,
} from '../buyer/buyer-profile-data.dto';

import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@InputType()
export class PartialBuyerProfileDataInput extends PartialType(
  BuyerProfileDataDto,
  InputType,
) {
  static adapter: FirebaseAdapter<
    Partial<BuyerProfileDB['data'] & { type: CustomerType }>, // TODO remove after hero24-types updated
    PartialBuyerProfileDataInput
  >;
}

PartialBuyerProfileDataInput.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    displayName: internal.displayName,
    isCreatedFromWeb: internal.isCreatedFromWeb,
    photoURL: internal.photoURL,
    type: internal.type,
  }),
  toInternal: (external) => ({
    displayName: external.displayName ?? undefined,
    isCreatedFromWeb: external.isCreatedFromWeb ?? undefined,
    photoURL: external.photoURL ?? undefined,
    type: external.type ?? undefined,
  }),
});
