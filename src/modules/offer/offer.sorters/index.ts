import { OfferOrderColumn } from '../dto/offers/offers-order.enum';
import { OffersComparePicker } from '../offer.types';

import { idComparePicker } from './id-compare-picker';
import { startTimeComparePicker } from './start-time-compare-picker';
import { statusComparePicker } from './status-compare-picker';

export const OFFER_SORTERS: Record<OfferOrderColumn, OffersComparePicker> = {
  [OfferOrderColumn.ID]: idComparePicker,
  [OfferOrderColumn.STATUS]: statusComparePicker,
  [OfferOrderColumn.START_TIME]: startTimeComparePicker,
};
