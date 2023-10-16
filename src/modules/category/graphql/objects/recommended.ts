import { Field, ObjectType } from '@nestjs/graphql';
import { RecommendedDB } from 'hero24-types';

import { WithId } from '$modules/common/common.types/with-id';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
export class RecommendedObject {
  @Field(() => String)
  id: string;

  @Field(() => String)
  categoryId: string;

  @Field(() => String)
  imageName: string;

  @Field(() => String)
  link: string;

  static adapter: FirebaseAdapter<WithId<RecommendedDB>, RecommendedObject>;
}

RecommendedObject.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    id: external.id,
    categoryId: external.categoryId,
    imageName: external.imageName,
    link: external.link,
  }),
  toExternal: (internal) => ({
    id: internal.id,
    categoryId: internal.categoryId,
    imageName: internal.imageName,
    link: internal.link,
  }),
});
