import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeactivateCardInput {
  @Field(() => String)
  cardId: string;
}
