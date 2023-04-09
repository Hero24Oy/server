import { Field, Int, ObjectType } from '@nestjs/graphql';
import { SellerProfileDB } from 'hero24-types';

@ObjectType()
export class SellerProfileDataDto {
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

  @Field(() => Int, { nullable: true })
  yearsOfExperience?: number;

  @Field(() => [String], { nullable: true })
  workAreas?: string[];

  @Field(() => String, { nullable: true })
  certificate?: string;

  @Field(() => Int, { nullable: true })
  weeksOfSentPurchaseInvoices?: number;

  static convertFromFirebaseType(
    sellerProfileData: SellerProfileDB['data'],
  ): SellerProfileDataDto {
    return {
      ...sellerProfileData,
      categories:
        sellerProfileData.categories &&
        Object.keys(sellerProfileData.categories),
    };
  }

  static converToFirebaseType(
    sellerProfileData: SellerProfileDataDto,
  ): SellerProfileDB['data'] {
    return {
      ...sellerProfileData,
      categories:
        sellerProfileData.categories &&
        Object.fromEntries(
          sellerProfileData.categories.map((id) => [id, true]),
        ),
    };
  }
}
