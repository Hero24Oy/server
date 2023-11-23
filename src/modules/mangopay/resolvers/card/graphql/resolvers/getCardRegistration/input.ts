import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetCardRegistrationInput {
  @Field(() => String)
  userId: string;
}
