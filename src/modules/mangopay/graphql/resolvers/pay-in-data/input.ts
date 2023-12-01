import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PayInDataInput {
  @Field(() => String)
  token: string;
}
