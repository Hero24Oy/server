/* eslint-disable @typescript-eslint/naming-convention */
import { Values } from 'src/modules/common/common.types';

// eslint-disable-next-line import/no-cycle
import { OfferRequestQuestionTypeEnum } from './offer-request-question.types';

export const QUESTION_FLAT_ID_NAME = 'depsId';

export const OfferRequestQuestionType: OfferRequestQuestionTypeEnum = {
  CHECKBOX: 'checkbox',
  DATE: 'date',
  IMAGE: 'image',
  LIST: 'list',
  NUMBER: 'number',
  NUMBER_INPUT: 'number_input',
  RADIO: 'radio',
  TEXTAREA: 'textarea',
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OfferRequestQuestionType = Values<typeof OfferRequestQuestionType>;
