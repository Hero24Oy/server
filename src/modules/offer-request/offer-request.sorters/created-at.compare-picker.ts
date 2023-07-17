import { OfferRequestComparePicker } from '../offer-request.types';

export const createdAtComparePicker: OfferRequestComparePicker<number> = (
  offerRequest,
) => Number(offerRequest.data.initial.createdAt);
