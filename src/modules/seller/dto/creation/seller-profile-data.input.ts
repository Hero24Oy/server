import { Field, InputType, Float } from '@nestjs/graphql';
import { SellerProfileDB } from 'hero24-types';

import {
  convertListToFirebaseMap,
  omitUndefined,
} from 'src/modules/common/common.utils';

@InputType()
export class SellerProfileDataInput {
  @Field(() => String)
  photoURL: string;

  @Field(() => String)
  companyName: string;

  @Field(() => String)
  companyEmail: string;

  @Field(() => String, { nullable: true })
  heroBIOText?: string;

  @Field(() => [String], { nullable: true })
  categories?: string[];

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
  yearsOfExperience?: number;

  @Field(() => [String], { nullable: true })
  workAreas?: string[];

  @Field(() => String, { nullable: true })
  certificate?: string;

  @Field(() => Float, { nullable: true })
  weeksOfSentPurchaseInvoices?: number;

  static convertToFirebaseType(
    sellerProfileData: SellerProfileDataInput,
  ): SellerProfileDB['data'] {
    return omitUndefined({
      ...sellerProfileData,
      categories:
        sellerProfileData.categories &&
        convertListToFirebaseMap(sellerProfileData.categories),
    });
  }
}
