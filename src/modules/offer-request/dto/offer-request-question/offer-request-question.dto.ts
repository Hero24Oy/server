import { createUnionType } from '@nestjs/graphql';
import { OfferRequestQuestion } from 'hero24-types';
import {
  convertFirebaseMapToList,
  convertListToFirebaseMap,
} from 'src/modules/common/common.utils';
import { SuitableTimeDto } from 'src/modules/common/dto/suitable-time/suitable-time.dto';

import { OfferRequestCheckBoxQuestionDto } from './offer-request-check-box-question.dto';
import { OfferRequestDateQuestionDto } from './offer-request-date-question.dto';
import { OfferRequestImageQuestionDto } from './offer-request-image-question.dto';
import { OfferRequestListPickerDto } from './offer-request-list-picker.dto';
import { OfferRequestNumberInputQuestionDto } from './offer-request-number-input-question.dto';
import { OfferRequestNumberQuestionDto } from './offer-request-number-question.dto';
import { OfferRequestQuestionOptionDto } from './offer-request-question-option.dto';
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

const convertToFirebaseType = (
  data: OfferRequestQuestionDto,
  plainQuestions: OfferRequestQuestionDto[],
): OfferRequestQuestion => {
  switch (data.type) {
    case 'radio':
      return {
        ...data,
        ...(data.selectedOption
          ? { selectedOption: data.selectedOption }
          : { selectedOption: null }),
        options: data.options.map((option) =>
          OfferRequestQuestionOptionDto.convertToFirebaseType(
            option,
            plainQuestions,
          ),
        ),
        name: data.name || null,
      };
    case 'checkbox':
      return {
        ...data,
        name: data.name || null,
        options: data.options.map((option) =>
          OfferRequestQuestionOptionDto.convertToFirebaseType(
            option,
            plainQuestions,
          ),
        ),
      };
    case 'textarea':
      return {
        ...data,
        name: data.name || null,
        placeholder: data.placeholder || null,
        value: data.value || null,
      };
    case 'list':
      return {
        ...data,
        name: data.name || null,
        placeholder: data.placeholder || null,
        value: typeof data.numericValue !== 'number' ? null : data.numericValue,
      };
    case 'number':
      return {
        ...data,
        name: data.name || null,
        placeholder: data.placeholder || null,
        value: typeof data.numericValue !== 'number' ? null : data.numericValue,
      };
    case 'date':
      return {
        ...data,
        name: data.name || null,
        preferredTime: data.preferredTime || null,
        suitableTimes: data.suitableTimes
          ? SuitableTimeDto.convertToFirebaseTime(data.suitableTimes)
          : null,
        suitableTimesCount:
          typeof data.suitableTimesCount !== 'number'
            ? null
            : data.suitableTimesCount,
      };
    case 'image':
      return {
        ...data,
        name: data.name || null,
        images: data.images ? convertListToFirebaseMap(data.images) : null,
        imageCount:
          typeof data.imageCount !== 'number' ? null : data.imageCount,
      };
    case 'number_input':
      return {
        ...data,
        name: data.name || null,
        placeholder: data.placeholder || null,
        extra_placeholder: data.extra_placeholder || null,
        value: data.value || null,
      };
  }
};

const convertFromFirebaseType = (
  data: OfferRequestQuestion,
  saveQuestion: (question: OfferRequestQuestion) => string, // return depsId
): OfferRequestQuestionDto => {
  let order = typeof data.order === 'number' ? data.order : Number(data.order);

  if (Number.isNaN(order)) {
    order = 0;
  }

  switch (data.type) {
    case 'radio':
    case 'checkbox':
      return {
        ...data,
        order,
        options: data.options.map((option) =>
          OfferRequestQuestionOptionDto.convertFromFirebaseType(
            option,
            saveQuestion,
          ),
        ),
      };
    case 'date':
      return {
        ...data,
        order,
        suitableTimes: data.suitableTimes
          ? SuitableTimeDto.convertFromFirebaseTime(data.suitableTimes)
          : null,
      };
    case 'image':
      return {
        ...data,
        order,
        images: convertFirebaseMapToList(data.images || {}),
      };
    case 'list':
    case 'number':
      return {
        ...data,
        order,
        numericValue: data.value,
      };
    case 'textarea':
    case 'number_input':
      return {
        ...data,
        order,
      };
  }
};

export const offerRequestQuestionDtoConvertor = {
  convertToFirebaseType,
  convertFromFirebaseType,
};
