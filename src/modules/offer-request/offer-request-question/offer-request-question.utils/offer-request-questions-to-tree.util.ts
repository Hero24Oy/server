import { OfferRequestQuestion } from 'hero24-types';

import { QUESTION_FLAT_ID_NAME } from '../offer-request-question.constants';
import {
  DependencyId,
  OmittedDependencyIdPlainOfferRequestQuestion,
  PlainOfferRequestQuestion,
} from '../offer-request-question.types';

import { fillQuestion } from './fill-question.util';

import { isString, omit } from '$imports/lodash';

export const offerRequestQuestionsToTree = (
  questions: PlainOfferRequestQuestion[],
): OfferRequestQuestion[] => {
  const mainQuestions: PlainOfferRequestQuestion[] = [];

  const questionById: Record<
    DependencyId,
    OmittedDependencyIdPlainOfferRequestQuestion
  > = {};

  questions.forEach((withDepsIdQuestion) => {
    const dependencyId = withDepsIdQuestion[QUESTION_FLAT_ID_NAME];

    const question = omit(
      withDepsIdQuestion,
      QUESTION_FLAT_ID_NAME,
    ) as OmittedDependencyIdPlainOfferRequestQuestion;

    if (isString(dependencyId)) {
      questionById[dependencyId] = question;
    } else {
      mainQuestions.push(question);
    }
  });

  return mainQuestions.map((question) => fillQuestion(question, questionById));
};
