import { Field, Float, ObjectType } from '@nestjs/graphql';
import { SellerProfileDB } from 'hero24-types';

import { SellerProfileDataDto } from './seller-profile-data';

import { MaybeType } from '$modules/common/common.types';
import { convertListToFirebaseMap } from '$modules/common/common.utils';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';
import { MangopayHeroObject } from '$modules/mangopay/graphql';

@ObjectType()
export class SellerProfileDto {
  @Field(() => String)
  id: string;

  @Field(() => SellerProfileDataDto)
  data: SellerProfileDataDto;

  @Field(() => Float, { nullable: true })
  rating?: MaybeType<number>;

  @Field(() => [String], { nullable: true })
  reviews?: MaybeType<string[]>;

  @Field(() => MangopayHeroObject)
  mangopay?: MaybeType<MangopayHeroObject>;

  static adapter: FirebaseAdapter<
    SellerProfileDB & { id: string },
    SellerProfileDto
  >;
}

SellerProfileDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    id: internal.id,
    data: SellerProfileDataDto.adapter.toExternal(internal.data),
    rating: internal.rating,
    reviews: internal.reviews ? Object.keys(internal.reviews) : null,
    mangopay: internal.mangopay,
  }),
  toInternal: (external) => ({
    id: external.id,
    data: SellerProfileDataDto.adapter.toInternal(external.data),
    rating: external.rating ?? undefined,
    reviews: external.reviews
      ? convertListToFirebaseMap(external.reviews)
      : undefined,
    mangopay: external.mangopay ?? undefined,
  }),
});
