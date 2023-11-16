import { CountryISO } from 'mangopay2-nodejs-sdk';

import { UserCategory } from '../enums';

export type MangopayNaturalBaseCreationData = {
  Email: string;
  FirstName: string;
  LastName: string;
};

export type MangopayNaturalPayerCreationData = {
  UserCategory: `${UserCategory.PAYER}`;
} & MangopayNaturalBaseCreationData;

export type MangopayNaturalOwnerCreationData = {
  Birthday: number;
  CountryOfResidence: CountryISO;
  Nationality: CountryISO;
  UserCategory: `${UserCategory.OWNER}`;
} & MangopayNaturalBaseCreationData;

export type MangopayNaturalUserCreationData =
  | MangopayNaturalPayerCreationData
  | MangopayNaturalOwnerCreationData;
