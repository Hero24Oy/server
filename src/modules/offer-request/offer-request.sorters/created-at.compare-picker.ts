import { OfferRequestComparePicker } from '../offer-request.types';

export const createdAtComparePicker: OfferRequestComparePicker<number> = (
  chat,
) => Number(chat.data.initial.createdAt);
