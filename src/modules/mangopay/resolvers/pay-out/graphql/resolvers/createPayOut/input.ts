import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreatePayOutInput {
  @Field(() => String)
  heroId: string;

  @Field(() => Int)
  amount: number;

  @Field(() => String)
  cardId: string;

  @Field(() => String)
  returnUrl: string;
}
