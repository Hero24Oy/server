import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PartialAddressInput {
  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  postalCode?: string;

  @Field(() => String, { nullable: true })
  streetAddress?: string;
}
