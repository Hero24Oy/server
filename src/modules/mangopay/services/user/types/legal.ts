import { CountryISO } from 'mangopay2-nodejs-sdk';

import { LegalPersonType, UserCategory } from '../enums';

import { MangopayAddress } from '$modules/mangopay/types';

export type MangopayLegalBaseCreationData = {
  email: string;
  legalPersonType: `${LegalPersonType}`;
  legalRepresentativeAddress: MangopayAddress;
  legalRepresentativeFirstName: string;
  legalRepresentativeLastName: string;
  name: string;
};

export type MangopayLegalPayerCreationData = {
  userCategory: `${UserCategory.PAYER}`;
} & MangopayLegalBaseCreationData;

export type MangopayLegalOwnerCreationData = {
  companyNumber: string;
  headquartersAddress: MangopayAddress;
  legalRepresentativeBirthday: number;
  legalRepresentativeCountryOfResidence: CountryISO;
  legalRepresentativeNationality: CountryISO;
  userCategory: `${UserCategory.OWNER}`;
} & MangopayLegalBaseCreationData;

export type MangopayLegalUserCreationData =
  | MangopayLegalPayerCreationData
  | MangopayLegalOwnerCreationData;
