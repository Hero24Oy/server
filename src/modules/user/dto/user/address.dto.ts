import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AddressDto {
  @Field(() => String)
  city: string;

  @Field(() => String)
  postalCode: string;

  @Field(() => String)
  streetAddress: string;
}
