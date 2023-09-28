import { ArgsType, Field } from '@nestjs/graphql';

import { PaginationArgs } from '$modules/common/dto/pagination.args';

@ArgsType()
export class HeroPortfolioListArgs extends PaginationArgs {
  @Field(() => String)
  sellerId: string;
}
