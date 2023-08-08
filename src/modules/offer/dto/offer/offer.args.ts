import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationArgs } from 'src/modules/common/dto/pagination.args';
import { OffersOrderInput } from './offer-order.input';
import { MaybeType } from 'src/modules/common/common.types';
import { OffersFilterInput } from './offer-filter.input';

@ArgsType()
export class OfferArgs extends PaginationArgs {
  @Field(() => OffersFilterInput, { nullable: true })
  filter?: MaybeType<OffersFilterInput>;

  @Field(() => [OffersOrderInput], { nullable: true })
  ordersBy?: MaybeType<OffersOrderInput[]>;
}
