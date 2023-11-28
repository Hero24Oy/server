import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TransactionInput {
  @Field(() => String)
  id: string;
}
