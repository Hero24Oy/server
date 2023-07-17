import { NeatFilter } from '../filterer/filterer.types';
import { ComparePicker, SortablePrimitives } from '../sorter/sorter.types';
import { OfferRequestDto } from './dto/offer-request/offer-request.dto';
import { OfferRequestFilterColumn } from './offer-request.constants';

export type OfferRequestSorterContext = Record<string, never>;

export type OfferRequestComparePicker<
  Primitive extends SortablePrimitives = SortablePrimitives,
> = ComparePicker<OfferRequestDto, OfferRequestSorterContext, Primitive>;

export type OfferRequestFiltererContext = Record<string, never>;

export type OfferRequestNeatFilter<Config> = NeatFilter<
  OfferRequestDto,
  OfferRequestFilterColumn.STATUS,
  OfferRequestFiltererContext,
  Config
>;
