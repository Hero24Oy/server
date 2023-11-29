import { InputType, PartialType } from '@nestjs/graphql';
import { CustomerProfileData } from 'hero24-types';

import { BuyerProfileDataDto } from '../buyer/buyer-profile-data.dto';

import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@InputType()
export class PartialBuyerProfileDataInput extends PartialType(
  BuyerProfileDataDto,
  InputType,
) {
  static adapter: FirebaseAdapter<
    Partial<CustomerProfileData>,
    PartialBuyerProfileDataInput
  >;
}

PartialBuyerProfileDataInput.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    displayName: internal.displayName,
    isCreatedFromWeb: internal.isCreatedFromWeb,
    photoURL: internal.photoURL,
    type: internal.type,
    businessId: internal.businessId ?? null,
  }),
  toInternal: (external) => ({
    displayName: external.displayName ?? undefined,
    isCreatedFromWeb: external.isCreatedFromWeb ?? undefined,
    photoURL: external.photoURL ?? undefined,
    type: undefined,
    businessId: undefined,
  }),
});
