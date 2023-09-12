import { DateQuestionDB, OfferRequestQuestion, QuestionDB } from 'hero24-types';
import differenceWith from 'lodash/differenceWith';
import isEqual from 'lodash/isEqual';

import { isDateQuestion } from './is-date-quesiton.util';

import { OfferRequestDataRequestedChangesChangedQuestionsDto } from '$/src/modules/offer-request/dto/offer-request/offer-request-data-requested-changes-changed-questions.dto';
import { OfferRequestQuestionDto } from '$/src/modules/offer-request/offer-request-question/dto/offer-request-question/offer-request-question.dto';

type ReturnType = {
  dateQuestion: DateQuestionDB | undefined;
  otherChanges: OfferRequestQuestion[];
};

export const getChangedQuestions = (
  requestedChanges: OfferRequestDataRequestedChangesChangedQuestionsDto,
  initialQuestions: OfferRequestQuestionDto[],
): ReturnType => {
  const differences = differenceWith(
    requestedChanges.after,
    initialQuestions,
    isEqual,
  );

  const dateQuestion = differences.find(isDateQuestion);

  const otherChanges = differences.filter(
    (question: OfferRequestQuestion | QuestionDB) => !isDateQuestion(question),
  );

  return {
    dateQuestion,
    otherChanges,
  };
};
