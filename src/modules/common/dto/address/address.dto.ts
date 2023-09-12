import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Address } from 'hero24-types';

import { FirebaseAdapter } from '$/src/modules/firebase/firebase.adapter';

@ObjectType()
@InputType('AddressInput')
export class AddressDto {
  @Field(() => String)
  city: string;

  @Field(() => String)
  postalCode: string;

  @Field(() => String)
  streetAddress: string;

  static adapter: FirebaseAdapter<Address, AddressDto>;
}

AddressDto.adapter = new FirebaseAdapter({
  toExternal: ({ city, postalCode, streetAddress }) => ({
    city,
    postalCode,
    streetAddress,
  }),
  toInternal: ({ city, postalCode, streetAddress }) => ({
    city,
    postalCode,
    streetAddress,
  }),
});
