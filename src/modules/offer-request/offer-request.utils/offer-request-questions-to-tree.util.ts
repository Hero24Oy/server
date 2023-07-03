import { OfferRequestQuestion } from 'hero24-types';
import {
  DependencyId,
  PlainOfferRequestQuestion,
  WithDependencyId,
} from '../offer-request-questions.types';
import { fillQuestion } from './fill-question.util';

export const offerRequestQuestionsToTree = <Name extends string>(
  questions: WithDependencyId<PlainOfferRequestQuestion, Name>[],
  idFieldName: Name,
): OfferRequestQuestion[] => {
  const mainQuestions: PlainOfferRequestQuestion[] = [];

  const questionById: Record<DependencyId, PlainOfferRequestQuestion> = {};

  questions.forEach((question) => {
    const dependencyId = (question as Record<Name, DependencyId>)[idFieldName];

    if (typeof dependencyId === 'string') {
      questionById[dependencyId] = question;
    } else {
      mainQuestions.push(question);
    }
  });

  return mainQuestions.map((question) => fillQuestion(question, questionById));
};
