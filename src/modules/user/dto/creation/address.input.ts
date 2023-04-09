import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddressInput {
  @Field(() => String)
  city: string;

  @Field(() => String)
  postalCode: string;

  @Field(() => String)
  streetAddress: string;
}
