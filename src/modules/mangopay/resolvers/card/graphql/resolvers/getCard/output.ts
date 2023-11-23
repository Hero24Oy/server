import { Field, ObjectType } from '@nestjs/graphql';

import { Card } from '../../objects';

@ObjectType()
export class GetCardOutput {
  @Field()
  card: Card;
}
