import {
  DateQuestionDB,
  OfferRequestDateQuestion,
  OfferRequestQuestion,
  QuestionDB,
} from 'hero24-types';

export type HasChangedQuestionsReturnType = {
  hasDateChanges: boolean;
  hasOtherChanges: boolean;
};

export type NonDateQuestion = Exclude<
  OfferRequestQuestion | QuestionDB,
  OfferRequestDateQuestion | DateQuestionDB
>;
