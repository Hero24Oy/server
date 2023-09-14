import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { AddressesAnswered } from 'hero24-types';

import { AddressDto } from '$modules/common/dto/address/address.dto';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
@InputType('BasicAddressesInput')
export class BasicAddressesDto {
  @Field(() => String)
  type = 'basic' as const;

  @Field(() => AddressDto)
  main: AddressDto;

  static adapter: FirebaseAdapter<
    AddressesAnswered & { type: 'basic' },
    BasicAddressesDto
  >;
}

BasicAddressesDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    type: internal.type,
    main: AddressDto.adapter.toExternal(internal.main),
  }),
  toInternal: (external) => ({
    type: external.type,
    main: AddressDto.adapter.toInternal(external.main),
  }),
});
