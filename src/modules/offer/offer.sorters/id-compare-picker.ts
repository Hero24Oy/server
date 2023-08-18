import { OffersComparePicker } from '../offer.types';

export const idComparePicker: OffersComparePicker<string> = (offer) =>
  offer.id || '';
