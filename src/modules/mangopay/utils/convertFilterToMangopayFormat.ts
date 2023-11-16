import { base as MangopayBase } from 'mangopay2-nodejs-sdk';

import { MangopayFilter } from '../types';

import { convertInputToMangopayFormat } from './convertInputToMangopayFormat';

export const convertFilterToMangopayFormat = (
  pagination: MangopayFilter,
): MangopayBase.FilterOptions => {
  const formattedPagination = convertInputToMangopayFormat(pagination);

  return formattedPagination;
};
