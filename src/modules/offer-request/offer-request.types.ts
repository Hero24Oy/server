import { OFFER_REQUEST_STATUS } from 'hero24-types';
import { ColumnFilter } from '../filterer/filterer.types';
import { ComparePicker, SortablePrimitives } from '../sorter/sorter.types';
import { OfferRequestDto } from './dto/offer-request/offer-request.dto';
import { OfferRequestFilterColumn } from './offer-request.constants';

export type OfferRequestSorterContext = Record<string, never>;

export type OfferRequestComparePicker<
  Primitive extends SortablePrimitives = SortablePrimitives,
> = ComparePicker<OfferRequestDto, OfferRequestSorterContext, Primitive>;

export type OfferRequestFiltererContext = Record<string, never>;

export type OfferRequestColumnFilter<Config> = ColumnFilter<
  OfferRequestDto,
  OfferRequestFilterColumn,
  OfferRequestFiltererContext,
  Config
>;

export type OfferRequestStatusEnum = {
  [Key in OFFER_REQUEST_STATUS as Uppercase<Key>]: Key;
};
