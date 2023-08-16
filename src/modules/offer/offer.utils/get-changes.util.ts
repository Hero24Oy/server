import { DateQuestionDB, OfferRequestQuestion } from 'hero24-types';
import isEqual from 'lodash/isEqual';
import differenceWith from 'lodash/differenceWith';

import { OfferRequestDataRequestedChangesChangedQuestionsDto } from 'src/modules/offer-request/dto/offer-request/offer-request-data-requested-changes-changed-questions.dto';
import { OfferRequestQuestionDto } from 'src/modules/offer-request/dto/offer-request-question/offer-request-question.dto';

import { isDateQuestion } from './is-date-quesiton.util';

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
    (question) => !isDateQuestion(question),
  );

  return {
    dateQuestion,
    otherChanges,
  };
};
