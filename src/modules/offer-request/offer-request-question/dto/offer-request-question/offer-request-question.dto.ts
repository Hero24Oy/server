import { createUnionType } from '@nestjs/graphql';
import { OfferRequestQuestion } from 'hero24-types';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

import { OfferRequestQuestionType } from '../../offer-request-question.constants';
import { PlainOfferRequestQuestion } from '../../offer-request-question.types';

import { OfferRequestCheckBoxQuestionDto } from './offer-request-check-box-question.dto';
import { OfferRequestDateQuestionDto } from './offer-request-date-question.dto';
import { OfferRequestImageQuestionDto } from './offer-request-image-question.dto';
import { OfferRequestListPickerDto } from './offer-request-list-picker.dto';
import { OfferRequestNumberInputQuestionDto } from './offer-request-number-input-question.dto';
import { OfferRequestNumberQuestionDto } from './offer-request-number-question.dto';
import { OfferRequestRadioQuestionDto } from './offer-request-radio-question.dto';
import { OfferRequestTextAreaQuestionDto } from './offer-request-text-area-question.dto';

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
      case OfferRequestQuestionType.RADIO:
        return OfferRequestRadioQuestionDto;
      case OfferRequestQuestionType.CHECKBOX:
        return OfferRequestCheckBoxQuestionDto;
      case OfferRequestQuestionType.TEXTAREA:
        return OfferRequestTextAreaQuestionDto;
      case OfferRequestQuestionType.LIST:
        return OfferRequestListPickerDto;
      case OfferRequestQuestionType.NUMBER:
        return OfferRequestNumberQuestionDto;
      case OfferRequestQuestionType.DATE:
        return OfferRequestDateQuestionDto;
      case OfferRequestQuestionType.IMAGE:
        return OfferRequestImageQuestionDto;
      case OfferRequestQuestionType.NUMBER_INPUT:
        return OfferRequestNumberInputQuestionDto;
    }
  },
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OfferRequestQuestionDto = typeof OfferRequestQuestionDto;

export const OfferRequestQuestionAdapter = new FirebaseAdapter<
  PlainOfferRequestQuestion,
  OfferRequestQuestionDto
>({
  toInternal(external) {
    const question = external as OfferRequestQuestionDto;

    switch (question.type) {
      case OfferRequestQuestionType.RADIO:
        return OfferRequestRadioQuestionDto.adapter.toInternal(question);
      case OfferRequestQuestionType.CHECKBOX:
        return OfferRequestCheckBoxQuestionDto.adapter.toInternal(question);
      case OfferRequestQuestionType.DATE:
        return OfferRequestDateQuestionDto.adapter.toInternal(question);
      case OfferRequestQuestionType.IMAGE:
        return OfferRequestImageQuestionDto.adapter.toInternal(question);
      case OfferRequestQuestionType.LIST:
        return OfferRequestListPickerDto.adapter.toInternal(question);
      case OfferRequestQuestionType.NUMBER:
        return OfferRequestNumberQuestionDto.adapter.toInternal(question);
      case OfferRequestQuestionType.TEXTAREA:
        return OfferRequestTextAreaQuestionDto.adapter.toInternal(question);
      case OfferRequestQuestionType.NUMBER_INPUT:
        return OfferRequestNumberInputQuestionDto.adapter.toInternal(question);
    }
  },
  toExternal(internal) {
    const question = internal as PlainOfferRequestQuestion;

    switch (question.type) {
      case OfferRequestQuestionType.RADIO:
        return OfferRequestRadioQuestionDto.adapter.toExternal(question);
      case OfferRequestQuestionType.CHECKBOX:
        return OfferRequestCheckBoxQuestionDto.adapter.toExternal(question);
      case OfferRequestQuestionType.DATE:
        return OfferRequestDateQuestionDto.adapter.toExternal(question);
      case OfferRequestQuestionType.IMAGE:
        return OfferRequestImageQuestionDto.adapter.toExternal(question);
      case OfferRequestQuestionType.LIST:
        return OfferRequestListPickerDto.adapter.toExternal(question);
      case OfferRequestQuestionType.NUMBER:
        return OfferRequestNumberQuestionDto.adapter.toExternal(question);
      case OfferRequestQuestionType.TEXTAREA:
        return OfferRequestTextAreaQuestionDto.adapter.toExternal(question);
      case OfferRequestQuestionType.NUMBER_INPUT:
        return OfferRequestNumberInputQuestionDto.adapter.toExternal(question);
    }
  },
});
