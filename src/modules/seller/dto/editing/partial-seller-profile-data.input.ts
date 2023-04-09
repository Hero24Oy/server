import { Field, InputType, Int } from '@nestjs/graphql';
import { SellerProfileDB } from 'hero24-types';
import { convertListToFirebaseMap } from 'src/modules/common/common.utils';

@InputType()
export class PartialSellerProfileDataInput {
  @Field(() => String, { nullable: true })
  photoURL?: string;

  @Field(() => String, { nullable: true })
  companyName?: string;

  @Field(() => String, { nullable: true })
  companyEmail?: string;

  @Field(() => String, { nullable: true })
  heroBIOText?: string;

  @Field(() => [String], { nullable: true })
  categories?: string[];

  @Field(() => String, { nullable: true })
  companyVAT?: string;

  @Field(() => [String], { nullable: true })
  langs?: string[];

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  streetAddress?: string;

  @Field(() => String, { nullable: true })
  postalCode?: string;

  @Field(() => Int, { nullable: true })
  yearsOfExperience?: number;

  @Field(() => [String], { nullable: true })
  workAreas?: string[];

  @Field(() => String, { nullable: true })
  certificate?: string;

  @Field(() => Int, { nullable: true })
  weeksOfSentPurchaseInvoices?: number;

  static converToFirebaseType(
    sellerProfileData: PartialSellerProfileDataInput,
  ): Partial<SellerProfileDB['data']> {
    return {
      ...sellerProfileData,
      categories:
        sellerProfileData.categories &&
        convertListToFirebaseMap(sellerProfileData.categories),
    };
  }
}
