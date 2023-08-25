import { Values } from '../common/common.types';
import { OfferStatusEnum } from './offer-request.types';

export const QUESTION_FLAT_ID_NAME = 'depsId';

export enum OfferRequestFilterColumn {
  STATUS = 'status',
}

export const OfferRequestStatus: OfferStatusEnum = {
  OPEN: 'open',
  ACCEPTED: 'accepted',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
};

export type OfferRequestStatus = Values<typeof OfferRequestStatus>;

export const OFFER_REQUEST_UPDATED_SUBSCRIPTION = 'offerRequestUpdated';
