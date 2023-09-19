import { OfferRequestQuestionTypeEnum } from '../../offer-request-question.types';

import { Values } from '$modules/common/common.types';

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

export type OfferRequestQuestionType = Values<typeof OfferRequestQuestionType>;
