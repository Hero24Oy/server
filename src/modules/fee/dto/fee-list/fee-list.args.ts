import { ArgsType, Field } from '@nestjs/graphql';

import { MaybeType } from 'src/modules/common/common.types';
import { PaginationArgs } from 'src/modules/common/dto/pagination.args';

import { FeeListFilterInput } from './fee-list-filter.input';
import { FeeListOrderInput } from './fee-list-order.input';

@ArgsType()
export class FeeListArgs extends PaginationArgs {
  @Field(() => FeeListFilterInput, { nullable: true })
  filter?: MaybeType<FeeListFilterInput>;

  @Field(() => [FeeListOrderInput], { nullable: true })
  ordersBy?: MaybeType<FeeListOrderInput[]>;
}
