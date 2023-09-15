import {
  DateQuestionDB,
  OfferRequestDateQuestion,
  OfferRequestQuestion,
  QuestionDB,
} from 'hero24-types';

export type GetChangedQuestionsReturnType = {
  isDateChanges: boolean;
  isOtherChanges: boolean;
};

export type ChangedQuestionsWithoutDate = Exclude<
  OfferRequestQuestion | QuestionDB,
  OfferRequestDateQuestion | DateQuestionDB
>;
