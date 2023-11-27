import { Field, ObjectType } from '@nestjs/graphql';

import { TransactionObject } from '../../objects';

@ObjectType()
export class TransactionByIdOutput {
  @Field(() => TransactionObject)
  transaction: TransactionObject;
}
