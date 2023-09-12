/* eslint-disable @typescript-eslint/naming-convention */
import { Values } from '../common/common.types';

// eslint-disable-next-line import/no-cycle
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

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OfferRequestStatus = Values<typeof OfferRequestStatus>;

export const OFFER_REQUEST_UPDATED_SUBSCRIPTION = 'offerRequestUpdated';
