import {
  OfferRequestCheckBoxQuestion,
  OfferRequestDateQuestion,
  OfferRequestImageQuestion,
  OfferRequestListPicker,
  OfferRequestNumberInputQuestion,
  OfferRequestNumberQuestion,
  OfferRequestQuestionOption,
  OfferRequestRadioQuestion,
  OfferRequestTextAreaQuestion,
} from 'hero24-types';

export type DependencyId = string;

type AlreadyPlainOfferRequestQuestion =
  | OfferRequestTextAreaQuestion
  | OfferRequestNumberQuestion
  | OfferRequestNumberInputQuestion
  | OfferRequestListPicker
  | OfferRequestDateQuestion
  | OfferRequestImageQuestion;

type WithPlainOptions<T> = Omit<T, 'options'> & {
  options: PlainOfferRequestQuestionOption[];
};

type ComplexOfferRequestQuestion =
  | WithPlainOptions<OfferRequestCheckBoxQuestion>
  | WithPlainOptions<OfferRequestRadioQuestion>;

export type PlainOfferRequestQuestionOption = Omit<
  OfferRequestQuestionOption,
  'questions'
> & {
  questions: DependencyId[] | null;
};

export type WithDependencyId<T, N extends string> = T &
  Partial<Record<N, DependencyId | undefined>>;

export type PlainOfferRequestQuestion =
  | AlreadyPlainOfferRequestQuestion
  | ComplexOfferRequestQuestion;
