import { OfferRequestQuestion, QuestionDB } from 'hero24-types';
import differenceWith from 'lodash/differenceWith';
import isEqual from 'lodash/isEqual';

import {
  ChangedQuestionsWithoutDate,
  GetChangedQuestionsReturnType,
} from '../types';

import { isDateQuestion } from './is-date-quesiton.util';
import { omitDependencyIds } from './omit-dependency-ids.util';

import { OfferRequestDataRequestedChangesChangedQuestionsDto } from '$modules/offer-request/dto/offer-request/offer-request-data-requested-changes-changed-questions.dto';
import { OfferRequestQuestionDto } from '$modules/offer-request/offer-request-question/dto/offer-request-question/offer-request-question.dto';

export const getChangedQuestions = (
  requestedChanges: OfferRequestDataRequestedChangesChangedQuestionsDto,
  initialQuestions: OfferRequestQuestionDto[],
): GetChangedQuestionsReturnType => {
  const requestedChangesWithoutDependencyIds = omitDependencyIds(
    requestedChanges.after,
  );

  const initialQuestionsWithoutDependencyIds =
    omitDependencyIds(initialQuestions);

  const differences = differenceWith(
    requestedChangesWithoutDependencyIds,
    initialQuestionsWithoutDependencyIds,
    isEqual,
  );

  const dateQuestion = differences.find(isDateQuestion);

  const otherChanges = differences.find(
    (question: OfferRequestQuestion | QuestionDB) => !isDateQuestion(question),
  ) as ChangedQuestionsWithoutDate | undefined;

  return {
    isDateChanges: Boolean(dateQuestion),
    isOtherChanges: Boolean(otherChanges),
  };
};
