import { base as MangoPayBase } from 'mangopay2-nodejs-sdk';

export type PayInParameters = {
  amount: number;
  authorId: string;
  browserInfo: MangoPayBase.BrowserInfoData;
  cardId: string;
  fee: number;
  ip: string;
  redirectUrl: string;
  walletId: string;
};
