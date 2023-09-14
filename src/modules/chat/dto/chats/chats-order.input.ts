import { Field, InputType } from '@nestjs/graphql';

import { ChatsOrderColumn } from './chats-order-column.enum';

import { SortOrder } from '$modules/common/sort-order/sort-order.enum';

@InputType()
export class ChatsOrderInput {
  @Field(() => ChatsOrderColumn)
  column: ChatsOrderColumn;

  @Field(() => SortOrder)
  order: SortOrder;
}
