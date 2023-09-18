import { OfferRequestQuestion, QuestionDB } from 'hero24-types';
import differenceWith from 'lodash/differenceWith';
import isEqual from 'lodash/isEqual';

import { HasChangedQuestionsReturnType, NonDateQuestion } from '../types';

import { isDateQuestion } from './is-date-quesiton.util';
import { omitDependencyIds } from './omit-dependency-ids.util';

import { OfferRequestDataRequestedChangesChangedQuestionsDto } from '$modules/offer-request/dto/offer-request/offer-request-data-requested-changes-changed-questions.dto';
import { OfferRequestQuestionDto } from '$modules/offer-request/offer-request-question/dto/offer-request-question/offer-request-question.dto';

export const hasChangedQuestions = (
  requestedChanges: OfferRequestDataRequestedChangesChangedQuestionsDto,
  initialQuestions: OfferRequestQuestionDto[],
): HasChangedQuestionsReturnType => {
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

  const anyOtherQuestion = differences.find(
    (question: OfferRequestQuestion | QuestionDB) => !isDateQuestion(question),
  ) as NonDateQuestion | undefined;

  return {
    hasDateChanges: Boolean(dateQuestion),
    hasOtherChanges: Boolean(anyOtherQuestion),
  };
};
