import { ArgsType, Field } from '@nestjs/graphql';

import { PaginationArgs } from '$/src/modules/common/dto/pagination.args';

@ArgsType()
export class UsersArgs extends PaginationArgs {
  @Field(() => String, { nullable: true })
  search?: string;
}
