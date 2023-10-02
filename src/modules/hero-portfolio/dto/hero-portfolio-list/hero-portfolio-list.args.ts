import { ArgsType, Field } from '@nestjs/graphql';

import { HeroPortfolioListOrderInput } from './hero-portfolio-list-order.input';

import { MaybeType } from '$modules/common/common.types';
import { PaginationArgs } from '$modules/common/dto/pagination.args';

@ArgsType()
export class HeroPortfolioListArgs extends PaginationArgs {
  @Field(() => String)
  sellerId: string;

  @Field(() => [HeroPortfolioListOrderInput], { nullable: true })
  ordersBy?: MaybeType<HeroPortfolioListOrderInput[]>;
}
