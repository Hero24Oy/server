import { Field, ObjectType } from '@nestjs/graphql';

import { TransactionObject } from '../../objects';

@ObjectType()
export class TransactionsByIdsOutput {
  @Field(() => [TransactionObject])
  transactions: TransactionObject[];
}
