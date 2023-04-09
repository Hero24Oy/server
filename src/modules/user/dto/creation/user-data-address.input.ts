import { Field, InputType } from '@nestjs/graphql';

import { AddressInput } from '../../../common/dto/address/address.input';

@InputType()
export class UserDataAddressInput {
  @Field(() => String)
  key: string;

  @Field(() => AddressInput)
  address: AddressInput;
}
