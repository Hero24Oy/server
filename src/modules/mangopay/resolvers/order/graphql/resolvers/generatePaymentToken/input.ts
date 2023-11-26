import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GeneratePaymentTokenInput {
  @Field(() => String)
  transactionId: string;
}
