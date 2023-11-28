import { Field, ObjectType } from '@nestjs/graphql';

import { TransactionObject } from '../../objects';

@ObjectType()
export class TransactionsByTaskRequestIdOutput {
  @Field(() => [TransactionObject])
  transactions: TransactionObject[];
}
