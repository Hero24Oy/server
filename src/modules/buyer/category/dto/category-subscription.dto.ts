import { Field, ObjectType } from '@nestjs/graphql';
import { CategorySubscriptionDB } from 'hero24-types';
import { omitUndefined } from 'src/modules/common/common.utils';

@ObjectType()
export class CategorySubscriptionDto {
  @Field(() => String)
  id: string;

  @Field(() => String)
  categoryId: string;

  @Field(() => Number)
  discount: number;

  @Field(() => String)
  discountFormat: 'fixed' | 'percentage';

  static convertFromFirebaseType(
    data: CategorySubscriptionDB,
    id: string,
  ): CategorySubscriptionDto {
    return {
      ...data,
      id,
    };
  }

  static convertToFirebaseType(data: CategorySubscriptionDto): CategorySubscriptionDB {
    return omitUndefined({
      ...data,
    });
  }
}
