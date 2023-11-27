import { Field, ObjectType } from '@nestjs/graphql';

import { TransactionObject } from '../../objects';

@ObjectType()
export class GetTransactionsByIdsOutput {
  @Field(() => [TransactionObject])
  transactions: TransactionObject[];
}
