import { Field, InputType } from '@nestjs/graphql';

import { HeroPortfolioOrderColumn } from './order-column';

import { SortOrder } from '$modules/common/sort-order/sort-order.enum';

@InputType()
export class HeroPortfolioListOrderInput {
  @Field(() => HeroPortfolioOrderColumn)
  column: HeroPortfolioOrderColumn;

  @Field(() => SortOrder)
  order: SortOrder;
}
