import { OfferRequestQuestion } from 'hero24-types';
import { Values } from '../common/common.types';
import { OfferRequestStatusEnum } from './offer-request.types';

export const QUESTION_FLAT_ID_NAME = 'depsId';

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

export type OfferRequestQuestionType = OfferRequestQuestion['type'];

export const OfferRequestQuestionType = {
  CHECKBOX: 'checkbox',
  DATE: 'date',
  IMAGE: 'image',
  LIST: 'list',
  NUMBER: 'number',
  NUMBER_INPUT: 'number_input',
  RADIO: 'radio',
  TEXTAREA: 'textarea',
} as const satisfies Record<
  Uppercase<OfferRequestQuestionType>,
  OfferRequestQuestionType
>;
