import { ArgsType, Field } from '@nestjs/graphql';

import { FeeListFilterInput } from './fee-list-filter.input';
import { FeeListOrderInput } from './fee-list-order.input';

import { MaybeType } from '$modules/common/common.types';
import { PaginationArgs } from '$modules/common/dto/pagination.args';

@ArgsType()
export class FeeListArgs extends PaginationArgs {
  @Field(() => FeeListFilterInput, { nullable: true })
  filter?: MaybeType<FeeListFilterInput>;

  @Field(() => [FeeListOrderInput], { nullable: true })
  ordersBy?: MaybeType<FeeListOrderInput[]>;
}
