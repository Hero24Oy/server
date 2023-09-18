import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ReviewDB } from 'hero24-types';

import { MaybeType } from '$modules/common/common.types';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
export class ReviewDto {
  @Field(() => String)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => String)
  sellerProfileId: string;

  @Field(() => String)
  text: string;

  @Field(() => Int)
  rating: number;

  @Field(() => String, { nullable: true })
  name?: MaybeType<string>;

  @Field(() => String)
  offerRequestId: string;

  @Field(() => String)
  offerId: string;

  @Field(() => String, { nullable: true })
  categoryId?: MaybeType<string>;

  static adapter: FirebaseAdapter<ReviewDB & { id: string }, ReviewDto>;
}

ReviewDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    id: internal.id,
    createdAt: new Date(internal.data.initial.createdAt),
    sellerProfileId: internal.data.initial.sellerProfile,
    text: internal.data.initial.text,
    rating: internal.data.initial.rating,
    name: internal.data.initial.name ?? undefined,
    offerRequestId: internal.data.initial.offerRequest,
    offerId: internal.data.initial.offer,
    categoryId: internal.data.initial.category ?? undefined,
  }),
  toInternal: (external) => ({
    id: external.id,
    data: {
      initial: {
        createdAt: Number(external.createdAt),
        sellerProfile: external.sellerProfileId,
        text: external.text,
        rating: external.rating,
        name: external.name ?? undefined,
        offerRequest: external.offerRequestId,
        offer: external.offerId,
        category: external.categoryId ?? undefined,
      },
    },
  }),
});
