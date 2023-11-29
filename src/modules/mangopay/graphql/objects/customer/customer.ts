import { createUnionType } from '@nestjs/graphql';
import { MangoPayCustomer, MangoPayUserType } from 'hero24-types';

import { MangopayIndividualCustomerObject } from './individual-customer';
import { MangopayProfessionalCustomerObject } from './professional-customer';

export const MangopayCustomerObject = createUnionType({
  name: 'MangopayCustomerObject',
  types: () =>
    [
      MangopayIndividualCustomerObject,
      MangopayProfessionalCustomerObject,
    ] as const,
  resolveType: (customer: MangoPayCustomer) => {
    if (customer.type === MangoPayUserType.INDIVIDUAL) {
      return MangopayIndividualCustomerObject;
    }

    return MangopayProfessionalCustomerObject;
  },
});

// eslint-disable-next-line @typescript-eslint/no-redeclare -- we need to create type for the union instead of using typeof
export type MangopayCustomerObject = typeof MangopayCustomerObject;
