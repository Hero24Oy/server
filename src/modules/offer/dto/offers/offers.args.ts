import { Field, InputType, IntersectionType, PickType } from '@nestjs/graphql';

import { OfferRoleInput } from '../offer/offer-role.input';

import { OffersFilterInput } from './offers-filter.input';
import { OffersOrderInput } from './offers-order.input';

import { MaybeType } from '$modules/common/common.types';
import { PaginationArgs } from '$modules/common/dto/pagination.args';

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
