import { Field, ObjectType } from '@nestjs/graphql';

import { TransactionObject } from '../../objects';

@ObjectType()
export class GetTransactionByIdOutput {
  @Field(() => TransactionObject)
  transaction: TransactionObject;
}
