import { createUnionType } from '@nestjs/graphql';
import { QuestionDB } from 'hero24-types';

import { CheckBoxQuestionObject } from './check-box';
import { DateQuestionObject } from './date';
import { ImageQuestionObject } from './image';
import { ListPickerQuestionObject } from './list-picker';
import { NumberQuestionObject } from './number';
import { NumberInputQuestionObject } from './number-input';
import { RadioQuestionObject } from './radio';
import { TextAreaQuestionObject } from './text-area';

import { QUESTION_UNION_MAPPER } from '$modules/category/constants';
import { PlainQuestion } from '$modules/category/types';
import { TypeSafeRequired } from '$modules/common/common.types';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

export const QuestionObject = createUnionType({
  name: 'QuestionObject',
  types: () => [
    RadioQuestionObject,
    CheckBoxQuestionObject,
    TextAreaQuestionObject,
    ListPickerQuestionObject,
    NumberQuestionObject,
    DateQuestionObject,
    ImageQuestionObject,
    NumberInputQuestionObject,
  ],
  resolveType: ({ type }: Pick<QuestionDB, 'type'>) => {
    return QUESTION_UNION_MAPPER[type];
  },
});

export type QuestionObject = typeof QuestionObject;

export const QuestionObjectAdapter = new FirebaseAdapter<
  PlainQuestion,
  typeof QuestionObject
>({
  toInternal(external) {
    const question = external as QuestionObject;

    return QUESTION_UNION_MAPPER[question.type].adapter.toInternal(
      question,
    ) as TypeSafeRequired<PlainQuestion>;
  },
  toExternal(internal) {
    const question = internal as PlainQuestion;

    return QUESTION_UNION_MAPPER[question.type].adapter.toExternal(question);
  },
});
