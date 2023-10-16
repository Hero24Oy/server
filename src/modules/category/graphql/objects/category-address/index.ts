import { createUnionType } from '@nestjs/graphql';
import { DeliveryAddressDB, MainAddressDB } from 'hero24-types';

import { CategoryDeliveryAddressObject } from './category-delivery-address';
import { CategoryMainAddressObject } from './category-main-address';

export const CategoryAddressObject = createUnionType({
  name: 'CategoryAddressesObject',
  types: () =>
    [CategoryMainAddressObject, CategoryDeliveryAddressObject] as const,
  resolveType(value: MainAddressDB & DeliveryAddressDB) {
    if (value.main) {
      return CategoryMainAddressObject;
    }

    if (value.from) {
      return CategoryDeliveryAddressObject;
    }

    return null;
  },
});

export type CategoryAddressObject = typeof CategoryAddressObject;
