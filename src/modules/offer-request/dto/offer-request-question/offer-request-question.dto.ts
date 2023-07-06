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
import { FirebaseAdapter } from 'src/modules/firebase/firebase-adapter.interfaces';

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

export const offerRequestQuestionAdapter = new FirebaseAdapter<
  PlainOfferRequestQuestion,
  OfferRequestQuestionDto
>({
  toInternal(external) {
    const question = external as OfferRequestQuestionDto;

    switch (question.type) {
      case 'radio':
        return OfferRequestRadioQuestionDto.adapter.toInternal(question);
      case 'checkbox':
        return OfferRequestCheckBoxQuestionDto.adapter.toInternal(question);
      case 'date':
        return OfferRequestDateQuestionDto.adapter.toInternal(question);
      case 'image':
        return OfferRequestImageQuestionDto.adapter.toInternal(question);
      case 'list':
        return OfferRequestListPickerDto.adapter.toInternal(question);
      case 'number':
        return OfferRequestNumberQuestionDto.adapter.toInternal(question);
      case 'textarea':
        return OfferRequestTextAreaQuestionDto.adapter.toInternal(question);
      case 'number_input':
        return OfferRequestNumberInputQuestionDto.adapter.toInternal(question);
    }
  },
  toExternal(internal) {
    const question = internal as PlainOfferRequestQuestion;

    switch (question.type) {
      case 'radio':
        return OfferRequestRadioQuestionDto.adapter.toExternal(question);
      case 'checkbox':
        return OfferRequestCheckBoxQuestionDto.adapter.toExternal(question);
      case 'date':
        return OfferRequestDateQuestionDto.adapter.toExternal(question);
      case 'image':
        return OfferRequestImageQuestionDto.adapter.toExternal(question);
      case 'list':
        return OfferRequestListPickerDto.adapter.toExternal(question);
      case 'number':
        return OfferRequestNumberQuestionDto.adapter.toExternal(question);
      case 'textarea':
        return OfferRequestTextAreaQuestionDto.adapter.toExternal(question);
      case 'number_input':
        return OfferRequestNumberInputQuestionDto.adapter.toExternal(question);
    }
  },
});
