import { OffersComparePicker } from '../offer.types';

export const startTimeComparePicker: OffersComparePicker<number> = (offer) =>
  offer.data.actualStartTime?.getTime() ||
  offer.data.initial.agreedStartTime.getTime() ||
  0;
