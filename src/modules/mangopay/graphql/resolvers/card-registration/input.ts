import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CardRegistrationInput {
  @Field(() => String)
  userId: string;
}
