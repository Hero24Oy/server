import { Field, ObjectType } from '@nestjs/graphql';
import { BuyerProfileDB } from 'hero24-types';

import { omitUndefined } from 'src/modules/common/common.utils';

@ObjectType()
export class BuyerProfileDataDto {
  @Field(() => String)
  displayName: string;

  @Field(() => String, { nullable: true })
  photoURL?: string;

  @Field(() => Boolean, { nullable: true })
  isCreatedFromWeb?: boolean;

  static convertFromFirebaseType(
    buyerProfileData: BuyerProfileDB['data'],
  ): BuyerProfileDataDto {
    return {
      ...buyerProfileData,
    };
  }

  static convertToFirebaseType(
    buyerProfileData: BuyerProfileDataDto,
  ): BuyerProfileDB['data'] {
    return omitUndefined({
      ...buyerProfileData,
    });
  }
}
