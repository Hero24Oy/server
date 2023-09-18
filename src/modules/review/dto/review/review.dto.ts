import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ReviewDB } from 'hero24-types';
import { MaybeType } from 'src/modules/common/common.types';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

@ObjectType()
export class ReviewDto {
  @Field(() => String)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => String)
  sellerProfile: string;

  @Field(() => String)
  text: string;

  @Field(() => Int)
  rating: number;

  @Field(() => String, { nullable: true })
  name?: MaybeType<string>;

  @Field(() => String)
  offerRequest: string;

  @Field(() => String)
  offer: string;

  @Field(() => String, { nullable: true })
  category?: MaybeType<string>;

  static adapter: FirebaseAdapter<ReviewDB & { id: string }, ReviewDto>;
}

ReviewDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    id: internal.id,
    createdAt: new Date(internal.data.initial.createdAt),
    sellerProfile: internal.data.initial.sellerProfile,
    text: internal.data.initial.text,
    rating: internal.data.initial.rating,
    name: internal.data.initial.name ?? undefined,
    offerRequest: internal.data.initial.sellerProfile,
    offer: internal.data.initial.sellerProfile,
    category: internal.data.initial.sellerProfile ?? undefined,
  }),
  toInternal: (external) => ({
    id: external.id,
    data: {
      initial: {
        createdAt: Number(external.createdAt),
        sellerProfile: external.sellerProfile,
        text: external.text,
        rating: external.rating,
        name: external.name ?? undefined,
        offerRequest: external.offerRequest,
        offer: external.offer,
        category: external.category ?? undefined,
      },
    },
  }),
});
