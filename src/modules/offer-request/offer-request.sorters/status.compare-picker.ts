import { OFFER_REQUEST_STATUS } from 'hero24-types';
import { OfferRequestComparePicker } from '../offer-request.types';

export const statusComparePicker: OfferRequestComparePicker<
  OFFER_REQUEST_STATUS
> = (chat) => chat.data.status;
