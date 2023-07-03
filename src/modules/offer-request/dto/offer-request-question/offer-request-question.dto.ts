import { createUnionType } from '@nestjs/graphql';
import { OfferRequestQuestion } from 'hero24-types';

import { OfferRequestCheckBoxQuestionDto } from './offer-request-check-box-question.dto';
import { OfferRequestDateQuestionDto } from './offer-request-date-question.dto';
import { OfferRequestImageQuestionDto } from './offer-request-image-question.dto';
import { OfferRequestListPickerDto } from './offer-request-list-picker.dto';
import { OfferRequestNumberInputQuestionDto } from './offer-request-number-input-question.dto';
import { OfferRequestNumberQuestionDto } from './offer-request-number-question.dto';
import { OfferRequestRadioQuestionDto } from './offer-request-radio-question.dto';
import { OfferRequestTextAreaQuestionDto } from './offer-request-text-area-question.dto';
import { PlainOfferRequestQuestion } from '../../offer-request-questions.types';

export const OfferRequestQuestionDto = createUnionType({
  name: 'OfferRequestQuestionDto',
  types: () => [
    OfferRequestRadioQuestionDto,
    OfferRequestCheckBoxQuestionDto,
    OfferRequestTextAreaQuestionDto,
    OfferRequestListPickerDto,
    OfferRequestNumberQuestionDto,
    OfferRequestDateQuestionDto,
    OfferRequestImageQuestionDto,
    OfferRequestNumberInputQuestionDto,
  ],
  resolveType: (item: Pick<OfferRequestQuestion, 'type'>) => {
    switch (item.type) {
      case 'radio':
        return OfferRequestRadioQuestionDto;
      case 'checkbox':
        return OfferRequestCheckBoxQuestionDto;
      case 'textarea':
        return OfferRequestTextAreaQuestionDto;
      case 'list':
        return OfferRequestListPickerDto;
      case 'number':
        return OfferRequestNumberQuestionDto;
      case 'date':
        return OfferRequestDateQuestionDto;
      case 'image':
        return OfferRequestImageQuestionDto;
      case 'number_input':
        return OfferRequestNumberInputQuestionDto;
    }
  },
});

export type OfferRequestQuestionDto = typeof OfferRequestQuestionDto;

export const createOfferRequestQuestionDto = (
  question: PlainOfferRequestQuestion,
): OfferRequestQuestionDto => {
  switch (question.type) {
    case 'radio':
      return new OfferRequestRadioQuestionDto().fromFirebase(question);
    case 'checkbox':
      return new OfferRequestCheckBoxQuestionDto().fromFirebase(question);
    case 'date':
      return new OfferRequestDateQuestionDto().fromFirebase(question);
    case 'image':
      return new OfferRequestImageQuestionDto().fromFirebase(question);
    case 'list':
      return new OfferRequestListPickerDto().fromFirebase(question);
    case 'number':
      return new OfferRequestNumberQuestionDto().fromFirebase(question);
    case 'textarea':
      return new OfferRequestTextAreaQuestionDto().fromFirebase(question);
    case 'number_input':
      return new OfferRequestNumberInputQuestionDto().fromFirebase(question);
  }
};
