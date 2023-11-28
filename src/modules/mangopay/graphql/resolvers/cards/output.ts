import { Field, ObjectType } from '@nestjs/graphql';

import { CardObject } from '../../objects';

@ObjectType()
export class CardsOutput {
  @Field(() => [CardObject])
  cards: CardObject[];
}
