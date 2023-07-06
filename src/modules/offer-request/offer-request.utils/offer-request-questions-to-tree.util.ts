import { OfferRequestQuestion } from 'hero24-types';
import {
  DependencyId,
  PlainOfferRequestQuestion,
  OmittedDependencyIdPlainOfferRequestQuestion,
} from '../offer-request-questions.types';
import { fillQuestion } from './fill-question.util';
import { omit } from 'lodash';
import { QUESTION_FLAT_ID_NAME } from '../offer-request.constants';

export const offerRequestQuestionsToTree = (
  questions: PlainOfferRequestQuestion[],
): OfferRequestQuestion[] => {
  const mainQuestions: PlainOfferRequestQuestion[] = [];

  const questionById: Record<
    DependencyId,
    OmittedDependencyIdPlainOfferRequestQuestion
  > = {};

  questions.forEach((question) => {
    const dependencyId = question[QUESTION_FLAT_ID_NAME];

    if (typeof dependencyId === 'string') {
      questionById[dependencyId] = omit(
        question,
        QUESTION_FLAT_ID_NAME,
      ) as OmittedDependencyIdPlainOfferRequestQuestion;
    } else {
      mainQuestions.push(question);
    }
  });

  return mainQuestions.map((question) => fillQuestion(question, questionById));
};
