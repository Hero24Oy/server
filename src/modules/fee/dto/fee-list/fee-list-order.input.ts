import { Field, InputType } from '@nestjs/graphql';

import { SortOrder } from 'src/modules/common/sort-order/sort-order.enum';

import { FeeListOrderColumn } from './fee-list-order-column.enum';

@InputType()
export class FeeListOrderInput {
  @Field(() => FeeListOrderColumn)
  column: FeeListOrderColumn;

  @Field(() => SortOrder)
  order: SortOrder;
}
