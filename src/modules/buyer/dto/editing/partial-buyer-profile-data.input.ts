import { InputType, PartialType } from '@nestjs/graphql';

import { BuyerProfileDataDto } from '../buyer/buyer-profile-data.dto';

import { CustomerProfileDataDB } from '$modules/buyer/customer.types';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@InputType()
export class PartialBuyerProfileDataInput extends PartialType(
  BuyerProfileDataDto,
  InputType,
) {
  static adapter: FirebaseAdapter<
    Partial<CustomerProfileDataDB>,
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
    businessName: internal.businessName ?? null,
  }),
  toInternal: (external) => ({
    displayName: external.displayName ?? undefined,
    isCreatedFromWeb: external.isCreatedFromWeb ?? undefined,
    photoURL: external.photoURL ?? undefined,
    type: external.type ?? undefined,
    businessId: external.businessId ?? undefined,
    businessName: external.businessName ?? undefined,
  }),
});
