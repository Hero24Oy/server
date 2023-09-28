import { Field, ObjectType } from '@nestjs/graphql';
import { HeroPortfolioDataDB } from 'hero24-types';

import { MaybeType } from '$modules/common/common.types';
import { convertListToFirebaseMap } from '$modules/common/common.utils';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
export class HeroPortfolioDataDto {
  @Field(() => String)
  id: string;

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
    HeroPortfolioDataDB & { id: string },
    HeroPortfolioDataDto
  >;
}

HeroPortfolioDataDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    id: internal.id,
    categoryId: internal.category,
    description: internal.description,
    imageIds: internal.images && Object.keys(internal.images),
    createdAt: new Date(internal.createdAt),
    updatedAt: new Date(internal.updatedAt),
  }),
  toInternal: (external) => ({
    id: external.id,
    category: external.categoryId,
    description: external.description,
    images: external.imageIds
      ? convertListToFirebaseMap(external.imageIds)
      : undefined,
    createdAt: Number(external.createdAt),
    updatedAt: Number(external.updatedAt),
  }),
});
