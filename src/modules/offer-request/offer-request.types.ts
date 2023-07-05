import { ComparePicker, SortablePrimitives } from '../sorter/sorter.types';
import { OfferRequestDto } from './dto/offer-request/offer-request.dto';

export type OfferRequestSorterContext = Record<string, never>;

export type OfferRequestComparePicker<
  Primitive extends SortablePrimitives = SortablePrimitives,
> = ComparePicker<OfferRequestDto, OfferRequestSorterContext, Primitive>;

export type OfferRequestFiltererContext = Record<string, never>;
