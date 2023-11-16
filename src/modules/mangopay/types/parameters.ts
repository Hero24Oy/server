import { MangopayFilter } from './filter';
import { MangopayPagination } from './pagination';

export type MangopayParameters = {
  filter?: MangopayFilter;
  pagination?: MangopayPagination;
};
