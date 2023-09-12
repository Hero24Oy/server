import { ArgsType, Field } from '@nestjs/graphql';

import { NewsListFilterInput } from './news-list-filter.input';

import { MaybeType } from '$/src/modules/common/common.types';
import { PaginationArgs } from '$/src/modules/common/dto/pagination.args';

@ArgsType()
export class NewsListArgs extends PaginationArgs {
  @Field(() => NewsListFilterInput, { nullable: true })
  filter?: MaybeType<NewsListFilterInput>;
}
