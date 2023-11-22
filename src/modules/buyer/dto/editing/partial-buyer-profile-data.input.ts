import { InputType, PartialType } from '@nestjs/graphql';
import { BuyerProfileDB } from 'hero24-types';

import { BuyerProfileDataDto } from '../buyer/buyer-profile-data.dto';

import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@InputType()
export class PartialBuyerProfileDataInput extends PartialType(
  BuyerProfileDataDto,
  InputType,
) {
  static adapter: FirebaseAdapter<
    Partial<BuyerProfileDB['data']>,
    PartialBuyerProfileDataInput
  >;
}

PartialBuyerProfileDataInput.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    displayName: internal.displayName,
    isCreatedFromWeb: internal.isCreatedFromWeb,
    photoURL: internal.photoURL,
  }),
  toInternal: (external) => ({
    displayName: external.displayName ?? undefined,
    isCreatedFromWeb: external.isCreatedFromWeb ?? undefined,
    photoURL: external.photoURL ?? undefined,
  }),
});
