import { BrowserInfoDataObject } from '../graphql';

export type PayInParameters = {
  amount: number;
  authorId: string;
  browserInfo: BrowserInfoDataObject;
  cardId: string;
  fee: number;
  ip: string;
  redirectUrl: string;
  walletId: string;
};
