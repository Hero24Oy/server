import { Field, InputType } from '@nestjs/graphql';

import { FeeListOrderColumn } from './fee-list-order-column.enum';

import { SortOrder } from '$modules/common/sort-order/sort-order.enum';

@InputType()
export class FeeListOrderInput {
  @Field(() => FeeListOrderColumn)
  column: FeeListOrderColumn;

  @Field(() => SortOrder)
  order: SortOrder;
}
