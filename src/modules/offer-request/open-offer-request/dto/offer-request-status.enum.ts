import { OfferRequestStatusEnum } from '../../offer-request.types';

import { Values } from '$/src/modules/common/common.types';

export const OfferRequestStatus: OfferRequestStatusEnum = {
  OPEN: 'open',
  ACCEPTED: 'accepted',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
};

export type OfferRequestStatus = Values<typeof OfferRequestStatus>;
