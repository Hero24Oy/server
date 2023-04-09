import { Field, ObjectType } from '@nestjs/graphql';

import { AddressDto } from '../../../common/dto/address/address.dto';

@ObjectType()
export class UserDataAddressDto {
  @Field(() => String)
  key: string;

  @Field(() => AddressDto)
  address: AddressDto;
}
