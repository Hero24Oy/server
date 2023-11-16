import { base as MangopayBase } from 'mangopay2-nodejs-sdk';

export type MangopayParameters = MangopayBase.PaginationOptions &
  MangopayBase.FilterOptions;
