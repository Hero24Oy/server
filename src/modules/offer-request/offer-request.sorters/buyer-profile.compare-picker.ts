import { OfferRequestComparePicker } from '../offer-request.types';

export const buyerProfileComparePicker: OfferRequestComparePicker<string> = (
  chat,
) => chat.data.initial.buyerProfile;
