import { StatusNeatFilterConfig, statusNeatFilter } from './status.neat-filter';

export type OfferRequestFiltererConfigs = {
  [statusNeatFilter.column]: StatusNeatFilterConfig;
};

export const OFFER_REQUEST_FILTERS = [statusNeatFilter];
