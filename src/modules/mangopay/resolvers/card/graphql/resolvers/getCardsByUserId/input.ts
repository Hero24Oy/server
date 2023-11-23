import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetCardsByUserInput {
  @Field(() => String)
  userId: string;
}
