import isEqual from 'lodash/isEqual';
import { ChangedQuestionsDB, InitialQuestionsDb } from '../types';
import differenceWith from 'lodash/differenceWith';
import { isDateQuestion } from './is-date-quesiton.util';
import { DateQuestionDB, OfferRequestQuestion } from 'hero24-types';

type ReturnType = {
  dateQuestion: DateQuestionDB | undefined;
  otherChanges: OfferRequestQuestion[];
};

export const getChangedQuestions = (
  requestedChanges: ChangedQuestionsDB,
  initialQuestions: InitialQuestionsDb,
): ReturnType => {
  const differences = differenceWith(
    requestedChanges.after,
    initialQuestions,
    isEqual,
  );

  const dateQuestion = differences.find(isDateQuestion);

  const otherChanges = differences.filter(
    (question) => !isDateQuestion(question),
  );

  return {
    dateQuestion,
    otherChanges,
  };
};
