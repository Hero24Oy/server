import { Field, InputType } from '@nestjs/graphql';

import { AddressInput } from './address.input';

@InputType()
export class UserDataAddressInput {
  @Field(() => String)
  key: string;

  @Field(() => AddressInput)
  address: AddressInput;
}
