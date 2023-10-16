import {
  CheckBoxQuestionDB,
  DateQuestionDB,
  ImageQuestionDB,
  ListPickerDB,
  NumberInputQuestionDB,
  NumberQuestionDB,
  QuestionOptionDB,
  RadioQuestionDB,
  TextAreaQuestionDB,
} from 'hero24-types';

import { QUESTION_FLAT_ID_NAME } from './constants';

export type DependencyId = string;

export interface PlainQuestionOption
  extends Omit<QuestionOptionDB, 'questions'> {
  questions: DependencyId[] | null;
}

type WithPlainOptions<Type> = Omit<Type, 'options'> & {
  options: PlainQuestionOption[];
};

type WithDependencyId<Type> = Type &
  Partial<Record<typeof QUESTION_FLAT_ID_NAME, DependencyId | undefined>>;

// Note: we should manually redefine each type to save the types
export type PlainQuestion =
  | WithDependencyId<TextAreaQuestionDB>
  | WithDependencyId<NumberQuestionDB>
  | WithDependencyId<NumberInputQuestionDB>
  | WithDependencyId<ListPickerDB>
  | WithDependencyId<DateQuestionDB>
  | WithDependencyId<ImageQuestionDB>
  | WithDependencyId<WithPlainOptions<CheckBoxQuestionDB>>
  | WithDependencyId<WithPlainOptions<RadioQuestionDB>>;
