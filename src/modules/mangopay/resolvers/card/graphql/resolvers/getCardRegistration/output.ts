import { Field, ObjectType } from '@nestjs/graphql';

import { CardRegistration } from '../../objects';

@ObjectType()
export class GetCardRegistrationOutput {
  @Field()
  cardRegistration: CardRegistration;
}
