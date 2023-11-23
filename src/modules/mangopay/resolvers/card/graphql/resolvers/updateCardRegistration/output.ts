import { Field, ObjectType } from '@nestjs/graphql';

import { CardRegistration } from '../../objects';

@ObjectType()
export class UpdateCardRegistrationOutput {
  @Field()
  cardRegistration: CardRegistration;
}
