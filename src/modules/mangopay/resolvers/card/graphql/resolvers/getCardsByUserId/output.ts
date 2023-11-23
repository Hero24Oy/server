import { Field, ObjectType } from '@nestjs/graphql';

import { CardObject } from '../../objects';

@ObjectType()
export class GetCardsByUserIdOutput {
  @Field(() => [CardObject])
  cards: CardObject[];
}
