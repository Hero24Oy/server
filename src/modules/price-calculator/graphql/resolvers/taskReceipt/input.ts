import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TaskReceiptInput {
  @Field(() => String)
  taskId: string;
}
