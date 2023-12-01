import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CardRegistrationObject {
  @Field(() => String)
  accessKey: string;

  @Field(() => String)
  preregistrationData: string;
}
