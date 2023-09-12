import { ArgsType, Field } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { PaginationArgs } from 'src/modules/common/dto/pagination.args';

import { ChatsFilterInput } from './chats-filter.input';
import { ChatsOrderInput } from './chats-order.input';

@ArgsType()
export class ChatsArgs extends PaginationArgs {
  @Field(() => ChatsFilterInput, { nullable: true })
  filter?: MaybeType<ChatsFilterInput>;

  @Field(() => [ChatsOrderInput], { nullable: true })
  ordersBy?: ChatsOrderInput[];
}
