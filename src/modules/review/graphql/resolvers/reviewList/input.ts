import { Field, InputType } from '@nestjs/graphql';

import { PaginationArgs } from '$modules/common/dto/pagination.args';

@InputType()
export class ReviewListInput extends PaginationArgs {
  @Field(() => String)
  sellerId: string;
}
