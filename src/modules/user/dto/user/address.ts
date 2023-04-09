import { Field, ObjectType } from '@nestjs/graphql';
import { Address as AddressType } from 'hero24-types';

@ObjectType()
export class Address implements AddressType {
  @Field(() => String)
  city: string;

  @Field(() => String)
  postalCode: string;

  @Field(() => String)
  streetAddress: string;
}
