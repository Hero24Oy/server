import { OfferRequestOrderColumn } from '../dto/offer-request-list/offer-request-order-column';
import { OfferRequestComparePicker } from '../offer-request.types';
import { buyerProfileComparePicker } from './buyer-profile.compare-picker';
import { createdAtComparePicker } from './created-at.compare-picker';
import { statusComparePicker } from './status.compare-picker';

export const OFFER_REQUEST_SORTERS: Record<
  OfferRequestOrderColumn,
  OfferRequestComparePicker
> = {
  [OfferRequestOrderColumn.BUYER]: buyerProfileComparePicker,
  [OfferRequestOrderColumn.CREATED_AT]: createdAtComparePicker,
  [OfferRequestOrderColumn.STATUS]: statusComparePicker,
};
