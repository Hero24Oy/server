import { Field, InputType, IntersectionType, PickType } from '@nestjs/graphql';

import { PaginationArgs } from 'src/modules/common/dto/pagination.args';
import { MaybeType } from 'src/modules/common/common.types';

import { OffersOrderInput } from './offers-order.input';
import { OffersFilterInput } from './offers-filter.input';
import { OfferRoleInput } from '../offer/offer-role.input';

@InputType()
export class OfferArgs extends IntersectionType(
  OfferRoleInput,
  PickType(PaginationArgs, ['limit', 'offset'], InputType),
) {
  @Field(() => OffersFilterInput, { nullable: true })
  filter?: MaybeType<OffersFilterInput>;

  @Field(() => [OffersOrderInput], { nullable: true })
  ordersBy?: MaybeType<OffersOrderInput[]>;
}
