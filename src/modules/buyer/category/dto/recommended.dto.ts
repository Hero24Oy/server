import { Field, ObjectType } from '@nestjs/graphql';
import { RecommendedDB } from 'hero24-types';
import { omitUndefined } from 'src/modules/common/common.utils';

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
      ...data
    });
  }
}
