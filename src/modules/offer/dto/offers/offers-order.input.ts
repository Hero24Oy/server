import { Field, InputType } from '@nestjs/graphql';

import { OfferOrderColumn } from './offers-order.enum';

import { SortOrder } from '$modules/common/sort-order/sort-order.enum';

@InputType()
export class OffersOrderInput {
  @Field(() => OfferOrderColumn)
  column: OfferOrderColumn;

  @Field(() => SortOrder)
  order: SortOrder;
}
