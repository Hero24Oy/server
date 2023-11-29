import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class MakePayOutInput {
  @Field(() => String)
  heroId: string;

  @Field(() => Int)
  amount: number;
}
