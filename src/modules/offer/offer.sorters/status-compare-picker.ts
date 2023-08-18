import { OffersComparePicker } from '../offer.types';

export const statusComparePicker: OffersComparePicker<string> = (offer) =>
  offer.status || '';
