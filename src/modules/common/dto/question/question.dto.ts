import { createUnionType } from '@nestjs/graphql';
import { QuestionDB } from 'hero24-types';

import { CheckBoxQuestionDto } from './check-box-question.dto';
import { DateQuestionDto } from './date-question.dto';
import { ImageQuestionDto } from './image-question.dto';
import { ListPickerDto } from './list-picker.dto';
import { NumberInputQuestionDto } from './number-input-question.dto';
import { NumberQuestionDto } from './number-question.dto';
import { RadioQuestionDto } from './radio-question.dto';
import { TextAreaQuestionDto } from './text-area-question.dto';
import { PlainQuestion } from './question.types';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

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

export const QuestionAdapter = new FirebaseAdapter<
  PlainQuestion,
  QuestionDto
>({
  toInternal(external) {
    const question = external as QuestionDto;

    switch (question.type) {
      case 'radio':
        return RadioQuestionDto.adapter.toInternal(question);
      case 'checkbox':
        return CheckBoxQuestionDto.adapter.toInternal(question);
      case 'date':
        return DateQuestionDto.adapter.toInternal(question);
      case 'image':
        return ImageQuestionDto.adapter.toInternal(question);
      case 'list':
        return ListPickerDto.adapter.toInternal(question);
      case 'number':
        return NumberQuestionDto.adapter.toInternal(question);
      case 'textarea':
        return TextAreaQuestionDto.adapter.toInternal(question);
      case 'number_input':
        return NumberInputQuestionDto.adapter.toInternal(question);
    }
  },
  toExternal(internal) {
    const question = internal as PlainQuestion;

    switch (question.type) {
      case 'radio':
        return RadioQuestionDto.adapter.toExternal(question);
      case 'checkbox':
        return CheckBoxQuestionDto.adapter.toExternal(question);
      case 'date':
        return DateQuestionDto.adapter.toExternal(question);
      case 'image':
        return ImageQuestionDto.adapter.toExternal(question);
      case 'list':
        return ListPickerDto.adapter.toExternal(question);
      case 'number':
        return NumberQuestionDto.adapter.toExternal(question);
      case 'textarea':
        return TextAreaQuestionDto.adapter.toExternal(question);
      case 'number_input':
        return NumberInputQuestionDto.adapter.toExternal(question);
    }
  },
});
