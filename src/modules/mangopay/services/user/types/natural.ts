import { CountryISO } from 'mangopay2-nodejs-sdk';

import { UserCategory } from '../enums';

export type MangopayNaturalBaseCreationData = {
  email: string;
  firstName: string;
  lastName: string;
};

export type MangopayNaturalPayerCreationData = {
  userCategory: `${UserCategory.PAYER}`;
} & MangopayNaturalBaseCreationData;

export type MangopayNaturalOwnerCreationData = {
  birthday: number;
  countryOfResidence: CountryISO;
  nationality: CountryISO;
  userCategory: `${UserCategory.OWNER}`;
} & MangopayNaturalBaseCreationData;

export type MangopayNaturalUserCreationData =
  | MangopayNaturalPayerCreationData
  | MangopayNaturalOwnerCreationData;
