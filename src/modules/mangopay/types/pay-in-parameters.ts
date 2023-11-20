import { base as MangoPayBase } from 'mangopay2-nodejs-sdk';

export type PayInParameters = {
  amount: number;
  author: string;
  browserInfo: MangoPayBase.BrowserInfoData;
  card: string;
  fee: number;
  ip: string;
  returnUrl: string;
  wallet: string;
};
