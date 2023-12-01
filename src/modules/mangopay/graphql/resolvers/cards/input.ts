import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CardsInput {
  @Field(() => String)
  userId: string;
}
