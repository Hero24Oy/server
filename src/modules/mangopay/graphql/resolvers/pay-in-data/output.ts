import { Field, ObjectType } from '@nestjs/graphql';

import { TransactionObject } from '$modules/transaction/graphql';

@ObjectType()
export class PayInDataOutput {
  @Field(() => TransactionObject)
  data: TransactionObject;
}
