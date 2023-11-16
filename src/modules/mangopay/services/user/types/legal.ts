import { address as MangopayAddress, CountryISO } from 'mangopay2-nodejs-sdk';

import { LegalPersonType, UserCategory } from '../enums';

export type MangopayLegalBaseCreationData = {
  Email: string;
  LegalPersonType: `${LegalPersonType}`;
  LegalRepresentativeAddress: MangopayAddress.AddressType;
  LegalRepresentativeFirstName: string;
  LegalRepresentativeLastName: string;
  Name: string;
};

export type MangopayLegalPayerCreationData = {
  userCategory: `${UserCategory.PAYER}`;
} & MangopayLegalBaseCreationData;

export type MangopayLegalOwnerCreationData = {
  CompanyNumber: string;
  HeadquartersAddress: MangopayAddress.AddressType;
  LegalRepresentativeBirthday: number;
  LegalRepresentativeCountryOfResidence: CountryISO;
  LegalRepresentativeNationality: CountryISO;
  UserCategory: `${UserCategory.OWNER}`;
} & MangopayLegalBaseCreationData;

export type MangopayLegalUserCreationData =
  | MangopayLegalPayerCreationData
  | MangopayLegalOwnerCreationData;
