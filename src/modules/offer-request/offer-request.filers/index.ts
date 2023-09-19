import {
  statusColumnFilter,
  StatusColumnFilterConfig,
} from './status.column-filter';

export type OfferRequestFiltererConfigs = {
  [statusColumnFilter.column]: StatusColumnFilterConfig;
};

export const OFFER_REQUEST_FILTERS = [statusColumnFilter];
