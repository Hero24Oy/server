import { Field, ObjectType } from '@nestjs/graphql';

import { ReceiptDto } from '$modules/price-calculator/graphql/objects';

@ObjectType()
export class TaskReceiptOutput {
  @Field(() => ReceiptDto)
  receipt: ReceiptDto;
}
