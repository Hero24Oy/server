import { QuestionType } from './enums';
import {
  BaseQuestionObject,
  CheckBoxQuestionObject,
  DateQuestionObject,
  ImageQuestionObject,
  ListPickerQuestionObject,
  NumberInputQuestionObject,
  NumberQuestionObject,
  RadioQuestionObject,
  TextAreaQuestionObject,
} from './graphql/objects/questions';

export enum DiscountFormat {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
}

export const QUESTION_FLAT_ID_NAME = 'depsId';

export const QUESTION_UNION_MAPPER: Record<
  QuestionType,
  typeof BaseQuestionObject
> = {
  [QuestionType.CHECKBOX]: CheckBoxQuestionObject,
  [QuestionType.DATE]: DateQuestionObject,
  [QuestionType.IMAGE]: ImageQuestionObject,
  [QuestionType.LIST_PICKER]: ListPickerQuestionObject,
  [QuestionType.NUMBER]: NumberQuestionObject,
  [QuestionType.NUMBER_INPUT]: NumberInputQuestionObject,
  [QuestionType.RADIO]: RadioQuestionObject,
  [QuestionType.TEXT_AREA]: TextAreaQuestionObject,
};

export const CATEGORIES_UPDATED_SUBSCRIPTION = 'categoriesUpdated';
export const CATEGORIES_CREATED_SUBSCRIPTION = 'categoriesCreated';
