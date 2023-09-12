import {
  OfferRequestCheckBoxQuestion,
  OfferRequestDateQuestion,
  OfferRequestImageQuestion,
  OfferRequestListPicker,
  OfferRequestNumberInputQuestion,
  OfferRequestNumberQuestion,
  OfferRequestQuestion,
  OfferRequestQuestionOption,
  OfferRequestRadioQuestion,
  OfferRequestTextAreaQuestion,
} from 'hero24-types';

import { QUESTION_FLAT_ID_NAME } from './offer-request-question.constants';

export type DependencyId = string;

type WithPlainOptions<T> = Omit<T, 'options'> & {
  options: PlainOfferRequestQuestionOption[];
};

type WithDependencyId<T> = T &
  Partial<Record<typeof QUESTION_FLAT_ID_NAME, DependencyId | undefined>>;

// Note: we should manually redefine each type to save the types
export type OmittedDependencyIdPlainOfferRequestQuestion =
  | OfferRequestTextAreaQuestion
  | OfferRequestNumberQuestion
  | OfferRequestNumberInputQuestion
  | OfferRequestListPicker
  | OfferRequestDateQuestion
  | OfferRequestImageQuestion
  | WithPlainOptions<OfferRequestCheckBoxQuestion>
  | WithPlainOptions<OfferRequestRadioQuestion>;

// Note: we should manually redefine each type to save the types
export type PlainOfferRequestQuestion =
  | WithDependencyId<OfferRequestTextAreaQuestion>
  | WithDependencyId<OfferRequestNumberQuestion>
  | WithDependencyId<OfferRequestNumberInputQuestion>
  | WithDependencyId<OfferRequestListPicker>
  | WithDependencyId<OfferRequestDateQuestion>
  | WithDependencyId<OfferRequestImageQuestion>
  | WithDependencyId<WithPlainOptions<OfferRequestCheckBoxQuestion>>
  | WithDependencyId<WithPlainOptions<OfferRequestRadioQuestion>>;

export type PlainOfferRequestQuestionOption = Omit<
  OfferRequestQuestionOption,
  'questions'
> & { questions: DependencyId[] | null };

export type OfferRequestQuestionTypeEnum = {
  [Key in OfferRequestQuestion['type'] as Uppercase<Key>]: Key;
};
