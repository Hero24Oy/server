import { createUnionType } from '@nestjs/graphql';
import {
  MangoPayCustomer,
  MangoPayIndividualCustomer,
  MangoPayProfessionalCustomer,
  MangoPayUserType,
} from 'hero24-types';

import { MangopayIndividualCustomerObject } from './individual-customer';
import { MangopayProfessionalCustomerObject } from './professional-customer';

import { assertNever } from '$modules/common/common.utils';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

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

export const MangopayCustomerObjectAdapter = new FirebaseAdapter<
  MangoPayCustomer,
  MangopayCustomerObject
>({
  toExternal: (internal: MangoPayCustomer) => {
    switch (internal.type) {
      case MangoPayUserType.INDIVIDUAL:
        return {
          type: internal.type,
          id: internal.id,
          walletId: internal.walletId,
        } as MangopayIndividualCustomerObject;
      case MangoPayUserType.PROFESSIONAL:
        return {
          type: internal.type,
          id: internal.id,
          walletId: internal.walletId,
          businessOwner: internal.businessOwner,
        } as MangopayProfessionalCustomerObject;
      default:
        assertNever(internal);
    }
  },
  toInternal: (external: MangopayCustomerObject) => {
    switch (external.type) {
      case MangoPayUserType.INDIVIDUAL:
        return {
          type: external.type,
          id: external.id,
          walletId: external.walletId,
        } as MangoPayIndividualCustomer;
      case MangoPayUserType.PROFESSIONAL:
        return {
          type: external.type,
          id: external.id,
          walletId: external.walletId,
          businessOwner: external.businessOwner,
        } as MangoPayProfessionalCustomer;
      default:
        assertNever(external);
    }
  },
});

// eslint-disable-next-line @typescript-eslint/no-redeclare -- we need to create type for the union instead of using typeof
export type MangopayCustomerObject = typeof MangopayCustomerObject;
