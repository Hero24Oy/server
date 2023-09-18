import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationArgs } from 'src/modules/common/dto/pagination.args';

@ArgsType()
export class ReviewListArgs extends PaginationArgs {
  @Field(() => String)
  sellerId: string;
}
