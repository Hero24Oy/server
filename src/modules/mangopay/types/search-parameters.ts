import { base as MangopayBase } from 'mangopay2-nodejs-sdk';

export type MangopaySearchParameters = MangopayBase.PaginationOptions &
  MangopayBase.FilterOptions;
