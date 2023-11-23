import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetCardInput {
  @Field(() => String)
  cardId: string;
}
