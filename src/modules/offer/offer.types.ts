import { OfferRequestDB } from 'hero24-types';

import { ComparePicker, SortablePrimitives } from '../sorter/sorter.types';
import { OfferDto } from './dto/offer/offer.dto';

export type OffersComparePicker<
  Primitive extends SortablePrimitives = SortablePrimitives,
> = ComparePicker<OfferDto, null, Primitive>;

export type Questions = OfferRequestDB['data']['initial']['questions'];
