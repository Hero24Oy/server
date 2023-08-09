import { ArgsType, Field } from '@nestjs/graphql';

import { PaginationArgs } from 'src/modules/common/dto/pagination.args';
import { MaybeType } from 'src/modules/common/common.types';

import { OffersOrderInput } from './offers-order.input';
import { OffersFilterInput } from './offers-filter.input';

@ArgsType()
export class OfferArgs extends PaginationArgs {
  @Field(() => OffersFilterInput, { nullable: true })
  filter?: MaybeType<OffersFilterInput>;

  @Field(() => [OffersOrderInput], { nullable: true })
  ordersBy?: OffersOrderInput[];
}
