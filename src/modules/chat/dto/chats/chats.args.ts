import { ArgsType, Field } from '@nestjs/graphql';

import { ChatsFilterInput } from './chats-filter.input';
import { ChatsOrderInput } from './chats-order.input';

import { MaybeType } from '$modules/common/common.types';
import { PaginationArgs } from '$modules/common/dto/pagination.args';

@ArgsType()
export class ChatsArgs extends PaginationArgs {
  @Field(() => ChatsFilterInput, { nullable: true })
  filter?: MaybeType<ChatsFilterInput>;

  @Field(() => [ChatsOrderInput], { nullable: true })
  ordersBy?: ChatsOrderInput[];
}
