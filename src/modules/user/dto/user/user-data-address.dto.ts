import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { UserDB } from 'hero24-types';

import { AddressDto } from '../../../common/dto/address/address.dto';

import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
@InputType('UserDataAddressInput')
export class UserDataAddressDto {
  @Field(() => String)
  key: string;

  @Field(() => AddressDto)
  address: AddressDto;

  static adapter: FirebaseAdapter<
    Exclude<UserDB['data']['addresses'], undefined>,
    UserDataAddressDto[]
  >;
}

UserDataAddressDto.adapter = new FirebaseAdapter({
  toExternal: (internal) =>
    Object.keys(internal).map((key) => ({
      key,
      address: AddressDto.adapter.toExternal(internal[key] as AddressDto),
    })),
  toInternal: (external) =>
    Object.fromEntries(
      external.map(({ key, address }) => [
        key,
        AddressDto.adapter.toInternal(address),
      ]),
    ),
});
