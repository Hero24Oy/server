import { OFFER_REQUEST_STATUS } from 'hero24-types';

import { NeatFilter } from 'src/modules/filterer/filterer.types';

import { OfferRequestDto } from '../dto/offer-request/offer-request.dto';
import { OfferRequestFilterColumn } from '../offer-request.constants';

export type StatusNeatFilterConfig = OFFER_REQUEST_STATUS[];

export const statusNeatFilter: NeatFilter<
  OfferRequestDto,
  OfferRequestFilterColumn.STATUS,
  Record<string, never>,
  StatusNeatFilterConfig
> = {
  column: OfferRequestFilterColumn.STATUS,

  passJudgment(
    item: OfferRequestDto,
    _context: Record<string, never>,
    statuses?: OFFER_REQUEST_STATUS[] | undefined,
  ): boolean {
    if (!statuses || !statuses.length) {
      return true;
    }

    return statuses.includes(item.data.status);
  },
};
