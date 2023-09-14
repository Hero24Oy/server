import { Field, Float, ObjectType } from '@nestjs/graphql';
import { SellerProfileDB } from 'hero24-types';

import { SellerProfileDataDto } from './seller-profile-data';

import { MaybeType } from '$modules/common/common.types';
import { convertListToFirebaseMap } from '$modules/common/common.utils';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

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
  }),
  toInternal: (external) => ({
    id: external.id,
    data: SellerProfileDataDto.adapter.toInternal(external.data),
    rating: external.rating ?? undefined,
    reviews: external.reviews
      ? convertListToFirebaseMap(external.reviews)
      : undefined,
  }),
});
