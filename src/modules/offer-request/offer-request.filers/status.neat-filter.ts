import { OFFER_REQUEST_STATUS } from 'hero24-types';

import { OfferRequestFilterColumn } from '../offer-request.constants';
import { OfferRequestNeatFilter } from '../offer-request.types';

export type StatusNeatFilterConfig = OFFER_REQUEST_STATUS[];

export const statusNeatFilter: OfferRequestNeatFilter<StatusNeatFilterConfig> =
  {
    column: OfferRequestFilterColumn.STATUS,

    passJudgment(item, _context, statuses) {
      if (!statuses || !statuses.length) {
        return true;
      }

      return statuses.includes(item.data.status);
    },
  };
