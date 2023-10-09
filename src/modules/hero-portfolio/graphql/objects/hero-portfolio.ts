import { Field, ObjectType } from '@nestjs/graphql';

import { MaybeType } from '$modules/common/common.types';
import { convertListToFirebaseMap } from '$modules/common/common.utils';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';
import { HeroPortfolioDataWithIds } from '$modules/hero-portfolio/types';

@ObjectType()
export class HeroPortfolioObject {
  @Field(() => String)
  id: string;

  @Field(() => String)
  sellerId: string;

  @Field(() => String)
  categoryId: string;

  @Field(() => String)
  description: string;

  @Field(() => [String], { nullable: true })
  imageIds?: MaybeType<string[]>;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  static adapter: FirebaseAdapter<
    HeroPortfolioDataWithIds,
    HeroPortfolioObject
  >;
}

HeroPortfolioObject.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    id: internal.id,
    sellerId: internal.sellerId,
    categoryId: internal.category,
    description: internal.description,
    imageIds: internal.images && Object.keys(internal.images),
    createdAt: new Date(internal.createdAt),
    updatedAt: new Date(internal.updatedAt),
  }),
  toInternal: (external) => ({
    id: external.id,
    category: external.categoryId,
    sellerId: external.sellerId,
    description: external.description,
    images: external.imageIds
      ? convertListToFirebaseMap(external.imageIds)
      : undefined,
    createdAt: Number(external.createdAt),
    updatedAt: Number(external.updatedAt),
  }),
});
