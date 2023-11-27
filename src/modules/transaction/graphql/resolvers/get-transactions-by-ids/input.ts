import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetTransactionsByIdsInput {
  @Field(() => [String])
  ids: string[];
}
