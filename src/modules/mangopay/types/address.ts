import { CountryISO } from 'mangopay2-nodejs-sdk';

export type MangopayAddress = {
  addressLine1: string;
  addressLine2: string;
  city: string;
  country: CountryISO;
  postalCode: string;
  region: string;
};
