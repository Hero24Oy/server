import { base as MangopayBase } from 'mangopay2-nodejs-sdk';

import { MangopayParameters } from '../types';

import { convertFilterToMangopayFormat } from './convertFilterToMangopayFormat';
import { convertPaginationToMangopayFormat } from './convertPaginationToMangopayFormat';

export const convertParametersToMangopayFormat = (
  parameters: MangopayParameters,
): MangopayBase.FilterOptions & MangopayBase.PaginationOptions => {
  const { pagination, filter } = parameters;

  const formattedPagination = pagination
    ? convertPaginationToMangopayFormat(pagination)
    : undefined;

  const formattedFilter = filter
    ? convertFilterToMangopayFormat(filter)
    : undefined;

  return { ...formattedPagination, ...formattedFilter };
};
