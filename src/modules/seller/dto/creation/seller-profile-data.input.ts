import { InputType, OmitType } from '@nestjs/graphql';

import { SellerProfileDataDto } from '../seller/seller-profile-data';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';
import { SellerProfileDB } from 'hero24-types';
import { convertListToFirebaseMap } from 'src/modules/common/common.utils';

@InputType()
export class SellerProfileDataInput extends OmitType(
  SellerProfileDataDto,
  [],
  InputType,
) {
  static adapter: FirebaseAdapter<
    SellerProfileDB['data'],
    SellerProfileDataDto
  >;
}

SellerProfileDataInput.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    photoURL: internal.photoURL,
    companyName: internal.companyName,
    companyEmail: internal.companyEmail,
    heroBIOText: internal.heroBIOText,
    categories: internal.categories ? Object.keys(internal.categories) : null,
    companyVAT: internal.companyVAT,
    langs: internal.langs,
    city: internal.city,
    streetAddress: internal.streetAddress,
    postalCode: internal.postalCode,
    yearsOfExperience: internal.yearsOfExperience,
    workAreas: internal.workAreas,
    certificate: internal.certificate,
    weeksOfSentPurchaseInvoices: internal.weeksOfSentPurchaseInvoices,
  }),
  toInternal: (external) => ({
    photoURL: external.photoURL,
    companyName: external.companyName,
    companyEmail: external.companyEmail,
    heroBIOText: external.heroBIOText ?? undefined,
    categories: external.categories
      ? convertListToFirebaseMap(external.categories)
      : undefined,
    companyVAT: external.companyVAT,
    langs: external.langs,
    city: external.city,
    streetAddress: external.streetAddress,
    postalCode: external.postalCode,
    yearsOfExperience: external.yearsOfExperience ?? undefined,
    workAreas: external.workAreas ?? undefined,
    certificate: external.certificate ?? undefined,
    weeksOfSentPurchaseInvoices:
      external.weeksOfSentPurchaseInvoices ?? undefined,
  }),
});
