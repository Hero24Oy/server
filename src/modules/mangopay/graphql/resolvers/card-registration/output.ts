import { Field, ObjectType } from '@nestjs/graphql';

import { CardRegistrationObject } from '../../objects';

@ObjectType()
export class CardRegistrationOutput {
  @Field(() => CardRegistrationObject)
  cardRegistration: CardRegistrationObject;
}
