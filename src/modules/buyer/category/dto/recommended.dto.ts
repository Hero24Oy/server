import { Field, ObjectType } from '@nestjs/graphql';
import { RecommendedDB } from 'hero24-types';
import { omitUndefined } from 'src/modules/common/common.utils';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

@ObjectType()
export class RecommendedDto {
  @Field(() => String)
  id: string;

  @Field(() => String)
  categoryId: string;

  @Field(() => String)
  imageName: string;

  @Field(() => String)
  link: string;

  static adapter: FirebaseAdapter<
    RecommendedDB & { id: string },
    RecommendedDto
  >;

  static convertFromFirebaseType(
    data: RecommendedDB,
    id: string,
  ): RecommendedDto {
    return {
      ...data,
      id,
    };
  }

  static convertToFirebaseType(data: RecommendedDto): RecommendedDB {
    return omitUndefined({
      ...data,
    });
  }
}

RecommendedDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => {
    return {
      ...internal,
      id: internal.id,
    };
  },
  toInternal: (external) => {
    return omitUndefined({
      ...external,
    });
  },
});
