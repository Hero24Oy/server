import { Field, Float, InputType } from '@nestjs/graphql';
import { HeroProfileData, HeroType } from 'hero24-types';

import { MaybeType } from '$modules/common/common.types';
import { convertListToFirebaseMap } from '$modules/common/common.utils';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@InputType()
export class PartialSellerProfileDataInput {
  @Field(() => HeroType, { nullable: true })
  type?: MaybeType<HeroType>;

  @Field(() => String, { nullable: true })
  photoURL?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  companyName?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  companyEmail?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  heroBIOText?: MaybeType<string>;

  @Field(() => [String], { nullable: true })
  categories?: MaybeType<string[]>;

  @Field(() => String, { nullable: true })
  companyVAT?: MaybeType<string>;

  @Field(() => [String], { nullable: true })
  langs?: MaybeType<string[]>;

  @Field(() => String, { nullable: true })
  city?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  streetAddress?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  postalCode?: MaybeType<string>;

  @Field(() => Float, { nullable: true })
  yearsOfExperience?: MaybeType<number>;

  @Field(() => [String], { nullable: true })
  workAreas?: MaybeType<string[]>;

  @Field(() => String, { nullable: true })
  certificate?: MaybeType<string>;

  @Field(() => Float, { nullable: true })
  weeksOfSentPurchaseInvoices?: MaybeType<number>;

  static adapter: FirebaseAdapter<
    Partial<HeroProfileData>,
    PartialSellerProfileDataInput
  >;
}

PartialSellerProfileDataInput.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    type: internal.type,
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
    type: undefined,
    photoURL: external.photoURL ?? undefined,
    companyName: external.companyName ?? undefined,
    companyEmail: external.companyEmail ?? undefined,
    heroBIOText: external.heroBIOText ?? undefined,
    categories: external.categories
      ? convertListToFirebaseMap(external.categories)
      : undefined,
    companyVAT: external.companyVAT ?? undefined,
    langs: external.langs ?? undefined,
    city: external.city ?? undefined,
    streetAddress: external.streetAddress ?? undefined,
    postalCode: external.postalCode ?? undefined,
    yearsOfExperience: external.yearsOfExperience ?? undefined,
    workAreas: external.workAreas ?? undefined,
    certificate: external.certificate ?? undefined,
    weeksOfSentPurchaseInvoices:
      external.weeksOfSentPurchaseInvoices ?? undefined,
  }),
});
