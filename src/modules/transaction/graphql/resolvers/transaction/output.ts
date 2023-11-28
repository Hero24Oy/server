import { Field, ObjectType } from '@nestjs/graphql';

import { TransactionObject } from '../../objects';

@ObjectType()
export class TransactionOutput {
  @Field(() => TransactionObject)
  transaction: TransactionObject;
}
