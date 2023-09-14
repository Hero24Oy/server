import { Field, InputType } from '@nestjs/graphql';
import { SortOrder } from 'src/modules/common/sort-order/sort-order.enum';

import { ChatsOrderColumn } from './chats-order-column.enum';

@InputType()
export class ChatsOrderInput {
  @Field(() => ChatsOrderColumn)
  column: ChatsOrderColumn;

  @Field(() => SortOrder)
  order: SortOrder;
}
