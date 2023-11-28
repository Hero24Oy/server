import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCardRegistrationInput {
  @Field(() => String)
  cardId: string;

  @Field(() => String)
  token: string;
}
