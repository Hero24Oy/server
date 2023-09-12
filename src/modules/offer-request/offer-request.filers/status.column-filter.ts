import { OFFER_REQUEST_STATUS } from 'hero24-types';

import {
  OfferRequestColumnFilter,
  OfferRequestFilterColumn,
} from '../offer-request.types';

export type StatusColumnFilterConfig = OFFER_REQUEST_STATUS[];

export const statusColumnFilter: OfferRequestColumnFilter<StatusColumnFilterConfig> =
  {
    column: OfferRequestFilterColumn.STATUS,

    shouldLeave(item, _context, statuses) {
      if (!statuses || !statuses.length) {
        return true;
      }

      return statuses.includes(item.data.status);
    },
  };
