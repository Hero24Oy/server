import { MangopayAddressObject } from '../graphql';

export type CreateBankAccountParameters = {
  address: MangopayAddressObject;
  firstName: string;
  heroId: string;
  iban: string;
  lastName: string;
  mangopayId: string;
};
