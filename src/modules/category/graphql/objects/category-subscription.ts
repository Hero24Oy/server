import { Field, ObjectType } from '@nestjs/graphql';
import { CategorySubscriptionDB } from 'hero24-types';

import { DiscountFormat } from '$modules/category/constants';
import { WithId } from '$modules/common/common.types/with-id';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
export class CategorySubscriptionObject {
  @Field(() => String)
  id: string;

  @Field(() => String)
  categoryId: string;

  @Field(() => Number)
  discount: number;

  @Field(() => String)
  discountFormat: `${DiscountFormat}`;

  static adapter: FirebaseAdapter<
    WithId<CategorySubscriptionDB>,
    CategorySubscriptionObject
  >;
}

CategorySubscriptionObject.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    id: external.id,
    categoryId: external.categoryId,
    discount: external.discount,
    discountFormat: external.discountFormat,
  }),
  toExternal: (internal) => ({
    id: internal.id,
    categoryId: internal.categoryId,
    discount: internal.discount,
    discountFormat: internal.discountFormat,
  }),
});
