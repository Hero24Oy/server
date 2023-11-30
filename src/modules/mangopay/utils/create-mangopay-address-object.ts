import { address as MangoPayAddress } from 'mangopay2-nodejs-sdk';

import { MangopayAddressObject } from '../graphql';

export const createMangopayAddressObject = (
  address: MangopayAddressObject,
): MangoPayAddress.AddressData => {
  return {
    AddressLine1: address.addressLine,
    AddressLine2: '',
    City: address.city,
    Country: address.country,
    PostalCode: address.postalCode,
    Region: address.region ?? '',
  };
};
