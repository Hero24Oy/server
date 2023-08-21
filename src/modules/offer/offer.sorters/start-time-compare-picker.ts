import { OffersComparePicker } from '../offer.types';

export const startTimeComparePicker: OffersComparePicker<number> = (offer) =>
  offer.data.initial.agreedStartTime.getTime();
