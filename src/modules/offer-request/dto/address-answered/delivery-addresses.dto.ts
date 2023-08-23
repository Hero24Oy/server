import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { AddressDto } from 'src/modules/common/dto/address/address.dto';

@ObjectType()
@InputType('DeliveryAddressesInput')
export class DeliveryAddressesDto {
  @Field(() => String)
  type = 'delivery' as const;

  @Field(() => AddressDto)
  from: AddressDto;

  @Field(() => AddressDto)
  to: AddressDto;
}
