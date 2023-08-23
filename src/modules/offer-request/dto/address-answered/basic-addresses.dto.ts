import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { AddressDto } from 'src/modules/common/dto/address/address.dto';

@ObjectType()
@InputType('BasicAddressesInput')
export class BasicAddressesDto {
  @Field(() => String)
  type = 'basic' as const;

  @Field(() => AddressDto)
  main: AddressDto;
}
