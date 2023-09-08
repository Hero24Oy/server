import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';

@ArgsType()
@InputType('PaginationInput')
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  offset?: number;

  @Field(() => Int, { nullable: true })
  limit?: number;
}
