import { OfferRequestComparePicker } from '../offer-request.types';

export const buyerProfileComparePicker: OfferRequestComparePicker<string> = (
  offerRequest,
) => offerRequest.data.initial.buyerProfile;
