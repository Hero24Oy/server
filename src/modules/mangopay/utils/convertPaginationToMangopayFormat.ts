import { base as MangopayBase } from 'mangopay2-nodejs-sdk';

import { MangopayField } from '../enums';
import { MangopayPagination } from '../types';

import { convertInputToMangopayFormat } from './convertInputToMangopayFormat';

export const convertPaginationToMangopayFormat = (
  pagination: MangopayPagination,
): MangopayBase.PaginationOptions => {
  const formattedPagination = convertInputToMangopayFormat(pagination);

  return {
    ...formattedPagination,
    [MangopayField.PER_PAGE]: pagination.perPage,
  };
};
