import { Field, ObjectType } from '@nestjs/graphql';
import { CategorySubscriptionDB } from 'hero24-types';
import { omitUndefined } from 'src/modules/common/common.utils';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

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

  static adapter: FirebaseAdapter<
    CategorySubscriptionDB & { id: string },
    CategorySubscriptionDto
  >;
}

CategorySubscriptionDto.adapter = new FirebaseAdapter({
  toInternal(external) {
    return {
      ...external,
    };
  },
  toExternal(internal) {
    return omitUndefined({
      ...internal,
    });
  },
});
