import { DateQuestionDB, OfferRequestQuestion } from 'hero24-types';
import isEqual from 'lodash/isEqual';
import differenceWith from 'lodash/differenceWith';

import { OfferRequestDataRequestedChangesChangedQuestionsDto } from 'src/modules/offer-request/dto/offer-request/offer-request-data-requested-changes-changed-questions.dto';
import { OfferRequestQuestionDto } from 'src/modules/offer-request/offer-request-question/dto/offer-request-question/offer-request-question.dto';

import { isDateQuestion } from './is-date-quesiton.util';
import { omitDependencyIds } from './omit-dependency-ids.util';

type ReturnType = {
  dateQuestion: DateQuestionDB | undefined;
  otherChanges: OfferRequestQuestion[];
};

export const getChangedQuestions = (
  requestedChanges: OfferRequestDataRequestedChangesChangedQuestionsDto,
  initialQuestions: OfferRequestQuestionDto[],
): ReturnType => {
  const requestedChangesWithoutDependencyIds = omitDependencyIds(requestedChanges.after);
  const initialQuestionsWithoutDependencyIds = omitDependencyIds(initialQuestions);

  const differences = differenceWith(
    requestedChangesWithoutDependencyIds,
    initialQuestionsWithoutDependencyIds,
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
