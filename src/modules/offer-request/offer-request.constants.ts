import { Values } from '../common/common.types';
import { OfferRequestStatusEnum } from './offer-request.types';

export enum OfferRequestFilterColumn {
  STATUS = 'status',
}

export const OfferRequestStatus: OfferRequestStatusEnum = {
  OPEN: 'open',
  ACCEPTED: 'accepted',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
};

export type OfferRequestStatus = Values<typeof OfferRequestStatus>;

export const OFFER_REQUEST_UPDATED_SUBSCRIPTION = 'offerRequestUpdated';
