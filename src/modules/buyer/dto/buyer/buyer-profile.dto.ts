import { Field, ObjectType } from '@nestjs/graphql';
import { BuyerProfileDB } from 'hero24-types';

import { omitUndefined } from 'src/modules/common/common.utils';

import { BuyerProfileDataDto } from './buyer-profile-data.dto';

@ObjectType()
export class BuyerProfileDto implements BuyerProfileDB {
  @Field(() => String)
  id: string;

  @Field(() => BuyerProfileDataDto)
  data: BuyerProfileDataDto;

  @Field(() => Boolean, { nullable: true })
  hasMadeApprovedRequest?: boolean;

  static convertFromFirebaseType(
    buyerProfile: BuyerProfileDB,
    id: string,
  ): BuyerProfileDto {
    return {
      id,
      ...buyerProfile,
      data: BuyerProfileDataDto.convertFromFirebaseType(buyerProfile.data),
    };
  }

  static convertToFirebaseType({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id,
    ...buyerProfile
  }: BuyerProfileDto): BuyerProfileDB {
    return omitUndefined({
      ...buyerProfile,
      data: BuyerProfileDataDto.convertToFirebaseType(buyerProfile.data),
    });
  }
}
