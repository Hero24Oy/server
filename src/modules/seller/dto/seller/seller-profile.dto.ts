import { Field, Int, ObjectType } from '@nestjs/graphql';
import { SellerProfileDB } from 'hero24-types';
import { SellerProfileDataDto } from './seller-profile-data';

@ObjectType()
export class SellerProfileDto {
  @Field(() => String)
  id: string;

  @Field(() => SellerProfileDataDto)
  data: SellerProfileDataDto;

  @Field(() => Int, { nullable: true })
  rating?: number;

  @Field(() => [String], { nullable: true })
  reviews?: string[];

  @Field(() => Boolean, { nullable: true })
  hasMadeApprovedRequest?: boolean;

  static convertFromFirebaseType(
    sellerProfile: SellerProfileDB,
    id: string,
  ): SellerProfileDto {
    return {
      id,
      ...sellerProfile,
      reviews: sellerProfile.reviews && Object.keys(sellerProfile.reviews),
      data: SellerProfileDataDto.convertFromFirebaseType(sellerProfile.data),
    };
  }

  static convertToFirebaseType({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id,
    ...sellerProfile
  }: SellerProfileDto): SellerProfileDB {
    return {
      ...sellerProfile,
      reviews:
        sellerProfile.reviews &&
        Object.fromEntries(sellerProfile.reviews.map((id) => [id, true])),
      data: SellerProfileDataDto.converToFirebaseType(sellerProfile.data),
    };
  }
}
