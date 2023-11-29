import {
  Field,
  Float,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { HeroProfileData, HeroType } from 'hero24-types';

import { MaybeType } from '$modules/common/common.types';
import { convertListToFirebaseMap } from '$modules/common/common.utils';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

registerEnumType(HeroType, {
  name: 'HeroType',
});

@ObjectType()
@InputType('SellerProfileDataInput')
export class SellerProfileDataDto {
  @Field(() => HeroType, { nullable: true })
  type?: MaybeType<HeroType>;

  @Field(() => String)
  photoURL: string;

  @Field(() => String)
  companyName: string;

  @Field(() => String)
  companyEmail: string;

  @Field(() => String, { nullable: true })
  heroBIOText?: MaybeType<string>;

  @Field(() => [String], { nullable: true })
  categories?: MaybeType<string[]>;

  @Field(() => String)
  companyVAT: string;

  @Field(() => [String])
  langs: string[];

  @Field(() => String)
  city: string;

  @Field(() => String)
  streetAddress: string;

  @Field(() => String)
  postalCode: string;

  @Field(() => Float, { nullable: true })
  yearsOfExperience?: MaybeType<number>;

  @Field(() => [String], { nullable: true })
  workAreas?: MaybeType<string[]>;

  @Field(() => String, { nullable: true })
  certificate?: MaybeType<string>;

  @Field(() => Float, { nullable: true })
  weeksOfSentPurchaseInvoices?: MaybeType<number>;

  static adapter: FirebaseAdapter<HeroProfileData, SellerProfileDataDto>;
}

SellerProfileDataDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    type: internal.type,
    photoURL: internal.photoURL,
    companyName: internal.companyName,
    companyEmail: internal.companyEmail,
    heroBIOText: internal.heroBIOText,
    categories: internal.categories ? Object.keys(internal.categories) : null,
    companyVAT: internal.companyVAT,
    langs: internal.langs || [],
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
