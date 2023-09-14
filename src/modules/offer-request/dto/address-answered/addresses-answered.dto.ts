import { createUnionType } from '@nestjs/graphql';
import { AddressesAnswered } from 'hero24-types';

import { BasicAddressesDto } from './basic-addresses.dto';
import { DeliveryAddressesDto } from './delivery-addresses.dto';

import { assertNever } from '$modules/common/common.utils';
import { AddressDto } from '$modules/common/dto/address/address.dto';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

export const AddressesAnsweredDto = createUnionType({
  name: 'AddressesAnsweredDto',
  types: () => [BasicAddressesDto, DeliveryAddressesDto] as const,
  resolveType: (address: Pick<AddressesAnswered, 'type'>) => {
    if (address.type === 'basic') {
      return BasicAddressesDto;
    }

    return DeliveryAddressesDto;
  },
});

export const AddressesAnsweredAdapter = new FirebaseAdapter<
  AddressesAnswered,
  AddressesAnsweredDto
>({
  toExternal: (internal: AddressesAnswered) => {
    switch (internal.type) {
      case 'basic':
        return {
          type: internal.type,
          main: AddressDto.adapter.toExternal(internal.main),
        };
      case 'delivery':
        return {
          type: internal.type,
          from: AddressDto.adapter.toExternal(internal.from),
          to: AddressDto.adapter.toExternal(internal.to),
        };
      default:
        assertNever(internal);
    }
  },
  toInternal: (external: AddressesAnsweredDto) => {
    switch (external.type) {
      case 'basic':
        return {
          type: external.type,
          main: AddressDto.adapter.toInternal(external.main),
        };
      case 'delivery':
        return {
          type: external.type,
          from: AddressDto.adapter.toInternal(external.from),
          to: AddressDto.adapter.toInternal(external.to),
        };
      default:
        assertNever(external);
    }
  },
});

export type AddressesAnsweredDto = typeof AddressesAnsweredDto;
