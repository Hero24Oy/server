import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { AddressesAnswered } from 'hero24-types';

import { AddressDto } from '$/src/modules/common/dto/address/address.dto';
import { FirebaseAdapter } from '$/src/modules/firebase/firebase.adapter';

@ObjectType()
@InputType('DeliveryAddressesInput')
export class DeliveryAddressesDto {
  @Field(() => String)
  type = 'delivery' as const;

  @Field(() => AddressDto)
  from: AddressDto;

  @Field(() => AddressDto)
  to: AddressDto;

  static adapter: FirebaseAdapter<
    AddressesAnswered & { type: 'delivery' },
    DeliveryAddressesDto
  >;
}

DeliveryAddressesDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    type: internal.type,
    from: AddressDto.adapter.toExternal(internal.from),
    to: AddressDto.adapter.toExternal(internal.to),
  }),
  toInternal: (external) => ({
    type: external.type,
    from: AddressDto.adapter.toInternal(external.from),
    to: AddressDto.adapter.toInternal(external.to),
  }),
});
