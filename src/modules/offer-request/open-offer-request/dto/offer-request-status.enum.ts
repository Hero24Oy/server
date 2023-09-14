import { Values } from '$modules/common/common.types';
import { OfferRequestStatusEnum } from '$modules/offer-request/offer-request.types';

export const OfferRequestStatus: OfferRequestStatusEnum = {
  OPEN: 'open',
  ACCEPTED: 'accepted',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
};

export type OfferRequestStatus = Values<typeof OfferRequestStatus>;
