import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TransactionsByTaskRequestIdInput {
  @Field(() => String)
  id: string;
}
