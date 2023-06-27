import { createUnionType } from '@nestjs/graphql';

import { BasicAddressesDto } from './basic-addresses.dto';
import { DeliveryAddressesDto } from './delivery-addresses.dto';

export const AddressesAnsweredDto = createUnionType({
  name: 'AddressesAnsweredDto',
  types: () => [BasicAddressesDto, DeliveryAddressesDto] as const,
});

export type AddressesAnsweredDto = typeof AddressesAnsweredDto;
