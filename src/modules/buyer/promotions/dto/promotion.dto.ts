import { Field, Float, ObjectType } from '@nestjs/graphql';
import { PromotionDB } from 'hero24-types';

import { timestampToDate } from 'src/modules/common/common.utils';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

@ObjectType()
export class PromotionDto {
  // TODO create common type for shared properties
  @Field(() => String)
  id: string;

  @Field(() => String)
  categoryId: string;

  @Field(() => Float)
  discount: number;

  // TODO to enum
  @Field(() => String)
  discountFormat: 'fixed' | 'percentage';

  @Field(() => Date)
  startDate: Date;

  @Field(() => Date)
  endDate: Date;

  @Field(() => String)
  description: string;

  static adapter: FirebaseAdapter<PromotionDB & { id: string }, PromotionDto>;
}

PromotionDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    id: internal.id,
    categoryId: internal.data.categoryId,
    discount: internal.data.discount,
    discountFormat: internal.data.discountFormat,
    startDate: timestampToDate(internal.data.startDate),
    endDate: timestampToDate(internal.data.endDate),
    description: internal.data.description,
  }),
  toInternal: (external) => ({
    id: external.id,
    data: {
      categoryId: external.categoryId,
      discount: external.discount,
      discountFormat: external.discountFormat,
      startDate: external.startDate.getTime(),
      endDate: external.endDate.getTime(),
      description: external.description,
    },
  }),
});
