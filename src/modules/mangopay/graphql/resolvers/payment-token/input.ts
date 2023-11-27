import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PaymentTokenInput {
  @Field(() => String)
  transactionId: string;
}
