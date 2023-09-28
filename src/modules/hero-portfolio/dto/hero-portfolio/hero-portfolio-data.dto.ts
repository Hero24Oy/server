import { Field, ObjectType } from '@nestjs/graphql';
import { HeroPortfolioDataDB } from 'hero24-types';

import { MaybeType } from '$modules/common/common.types';
import { convertListToFirebaseMap } from '$modules/common/common.utils';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
export class HeroPortfolioDataDto {
  @Field(() => String)
  category: string;

  @Field(() => String)
  description: string;

  @Field(() => [String], { nullable: true })
  imageIds?: MaybeType<string[]>;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  static adapter: FirebaseAdapter<HeroPortfolioDataDB, HeroPortfolioDataDto>;
}

HeroPortfolioDataDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    category: internal.category,
    description: internal.description,
    imageIds: internal.images && Object.keys(internal.images),
    createdAt: new Date(internal.createdAt),
    updatedAt: new Date(internal.updatedAt),
  }),
  toInternal: (external) => ({
    category: external.category,
    description: external.description,
    images: external.imageIds
      ? convertListToFirebaseMap(external.imageIds)
      : undefined,
    createdAt: Number(external.createdAt),
    updatedAt: Number(external.updatedAt),
  }),
});
