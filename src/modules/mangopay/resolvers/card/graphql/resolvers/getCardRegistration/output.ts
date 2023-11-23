import { Field, ObjectType } from '@nestjs/graphql';

import { CardRegistrationObject } from '../../objects';

@ObjectType()
export class GetCardRegistrationOutput {
  @Field(() => CardRegistrationObject)
  cardRegistration: CardRegistrationObject;
}
