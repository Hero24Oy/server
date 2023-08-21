import { createUnionType } from '@nestjs/graphql';
import { QuestionDB, QuestionOptionDB, QuestionOptionsDB } from 'hero24-types';

import {
  convertFirebaseMapToList,
  convertListToFirebaseMap,
  omitUndefined,
} from 'src/modules/common/common.utils';
import { SuitableTimeDto } from 'src/modules/common/dto/suitable-time/suitable-time.dto';

import { CheckBoxQuestionDto } from './check-box-question.dto';
import { DateQuestionDto } from './date-question.dto';
import { ImageQuestionDto } from './image-question.dto';
import { ListPickerDto } from './list-picker.dto';
import { NumberInputQuestionDto } from './number-input-question.dto';
import { NumberQuestionDto } from './number-question.dto';
import { QuestionOptionDto } from './question-option.dto';
import { RadioQuestionDto } from './radio-question.dto';
import { TextAreaQuestionDto } from './text-area-question.dto';
import { convertListToObjects } from '../../common.utils/convert-list-to-objects.util';

export const QuestionDto = createUnionType({
  name: 'QuestionDto',
  types: () => [
    RadioQuestionDto,
    CheckBoxQuestionDto,
    TextAreaQuestionDto,
    ListPickerDto,
    NumberQuestionDto,
    DateQuestionDto,
    ImageQuestionDto,
    NumberInputQuestionDto,
  ],
  resolveType: (item: Pick<QuestionDB, 'type'>) => {
    switch (item.type) {
      case 'radio':
        return RadioQuestionDto;
      case 'checkbox':
        return CheckBoxQuestionDto;
      case 'textarea':
        return TextAreaQuestionDto;
      case 'list':
        return ListPickerDto;
      case 'number':
        return NumberQuestionDto;
      case 'date':
        return DateQuestionDto;
      case 'image':
        return ImageQuestionDto;
      case 'number_input':
        return NumberInputQuestionDto;
    }
  },
});

export type QuestionDto = typeof QuestionDto;

const convertToFirebaseType = (
  data: QuestionDto,
  plainQuestions: QuestionDto[],
): QuestionDB => {
  let result: QuestionDB;
  let options: QuestionOptionsDB = {};

  switch (data.type) {
    case 'radio':
      options = convertListToObjects(
        data.options.map((option) =>
          QuestionOptionDto.convertToFirebaseType(option, plainQuestions),
        ),
      );
      result = {
        ...data,
        selectedOption: data.selectedOption ? data.selectedOption : undefined,
        options: options,
        optional: data.optional || undefined,
        showError: data.showError || undefined,
        position: data.position || undefined,
        name: data.name || undefined,
      };
      break;
    case 'checkbox':
      result = {
        ...data,
        options: convertListToObjects(data.options),
        optional: data.optional || undefined,
        showError: data.showError || undefined,
        position: data.position || undefined,
        name: data.name || undefined,
      };
      break;
    case 'textarea':
      result = {
        ...data,
        name: data.name || undefined,
        placeholder: data.placeholder || undefined,
        value: data.value || undefined,
        optional: data.optional || undefined,
        showError: data.showError || undefined,
        position: data.position || undefined,
      };
      break;
    case 'list':
      result = {
        ...data,
        name: data.name || undefined,
        placeholder: data.placeholder || undefined,
        defaultValue:
          typeof data.defaultValue !== 'number' ? undefined : data.defaultValue,
        optional: data.optional ? data.optional : undefined,
        showError: data.showError ? data.showError : undefined,
        position: data.position ? data.position : undefined,
      };
      break;
    case 'number':
      result = {
        ...data,
        name: data.name || undefined,
        placeholder: data.placeholder || undefined,
        defaultValue:
          typeof data.defaultValue !== 'number' ? undefined : data.defaultValue,
        optional: data.optional || undefined,
        showError: data.showError || undefined,
        position: data.position || undefined,
      };
      break;
    case 'date':
      result = {
        ...data,
        name: data.name || undefined,
        preferredTime: data.preferredTime ? +data.preferredTime : undefined,
        suitableTimes: data.suitableTimes
          ? SuitableTimeDto.convertToFirebaseTime(data.suitableTimes)
          : undefined,
        suitableTimesCount:
          typeof data.suitableTimesCount !== 'number'
            ? undefined
            : data.suitableTimesCount,
        optional: data.optional || undefined,
        showError: data.showError || undefined,
        position: data.position || undefined,
      };
      break;
    case 'image':
      result = {
        ...data,
        name: data.name || undefined,
        images: data.images ? convertListToFirebaseMap(data.images) : null,
        imageCount:
          typeof data.imageCount !== 'number' ? undefined : data.imageCount,
        optional: data.optional || undefined,
        showError: data.showError || undefined,
        position: data.position || undefined,
      };
      break;
    case 'number_input':
    default:
      result = {
        ...data,
        name: data.name || undefined,
        placeholder: data.placeholder || undefined,
        optional: data.optional || undefined,
        showError: data.showError || undefined,
        position: data.position || undefined,
      };
      break;
  }

  return omitUndefined(result);
};

const convertFromFirebaseType = (
  data: QuestionDB,
  saveQuestion: (question: QuestionDB) => string,
): QuestionDto => {
  let order = typeof data.order === 'number' ? data.order : Number(data.order);

  if (Number.isNaN(order)) {
    order = 0;
  }

  let options: QuestionOptionDto[] = [];

  switch (data.type) {
    case 'radio':
    case 'checkbox':
      for (const id in data.options) {
        const question: QuestionOptionDB = data.options[id];
        options.push(
          QuestionOptionDto.convertFromFirebaseType(question, id, saveQuestion),
        );
      }
      return {
        ...data,
        order,
        options: options,
      };
    case 'date':
      return {
        ...data,
        order,
        preferredTime: data.preferredTime ? new Date(data.preferredTime) : null,
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
        defaultValue: data.defaultValue,
      };
    case 'textarea':
    case 'number_input':
      return {
        ...data,
        order,
      };
  }
};

export const QuestionDtoConvertor = {
  convertToFirebaseType,
  convertFromFirebaseType,
};
