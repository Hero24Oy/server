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
import { QUESTION_FLAT_ID_NAME } from './question.constants';

export type DependencyId = string;

type WithPlainOptions<T> = Omit<T, 'options'> & {
  options: PlainQuestionOption[];
};

type WithDependencyId<T> = T &
  Partial<Record<typeof QUESTION_FLAT_ID_NAME, DependencyId | undefined>>;

// Note: we should manually redefine each type to save the types
export type OmittedDependencyIdPlainQuestion =
  | TextAreaQuestionDB
  | NumberQuestionDB
  | NumberInputQuestionDB
  | ListPickerDB
  | DateQuestionDB
  | ImageQuestionDB
  | WithPlainOptions<CheckBoxQuestionDB>
  | WithPlainOptions<RadioQuestionDB>;

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

export type PlainQuestionOption = Omit<QuestionOptionDB, 'questions'> & {
  questions: DependencyId[] | null;
};