import {
  DateQuestionDB,
  OfferRequestDateQuestion,
  OfferRequestQuestion,
  QuestionDB,
} from 'hero24-types';

export type HaveQuestionsChangesReturnType = {
  hasDateChanges: boolean;
  haveOtherChanges: boolean;
};

export type ChangedQuestionWithoutDate = Exclude<
  OfferRequestQuestion | QuestionDB,
  OfferRequestDateQuestion | DateQuestionDB
>;
