import { ArgsType, Field } from '@nestjs/graphql';

import { OfferRequestFilterInput } from './offer-request-filter.input';
import { OfferRequestOrderInput } from './offer-request-order.input';

import { MaybeType } from '$modules/common/common.types';
import { PaginationArgs } from '$modules/common/dto/pagination.args';
import { OfferRole } from '$modules/offer/dto/offer/offer-role.enum';

@ArgsType()
export class OfferRequestListArgs extends PaginationArgs {
  @Field(() => [OfferRequestOrderInput], { nullable: true })
  orderBy?: MaybeType<OfferRequestOrderInput[]>;

  @Field(() => OfferRequestFilterInput, { nullable: true })
  filter?: MaybeType<OfferRequestFilterInput>;

  // We use it local, we don't need to allow the user change it from client
  role?: OfferRole;
}
