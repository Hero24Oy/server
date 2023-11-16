import { MangopaySortOrder } from '../enums';

export type MangopayFilter = {
  afterDate?: number;
  beforeDate?: number;
  sort?: `${MangopaySortOrder}`;
};
