import { ArgsType, Field } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { PaginationArgs } from 'src/modules/common/dto/pagination.args';

import { NewsListFilterInput } from './news-list-filter.input';

@ArgsType()
export class NewsListArgs extends PaginationArgs {
  @Field(() => NewsListFilterInput, { nullable: true })
  filter?: MaybeType<NewsListFilterInput>;
}
