import { OfferRequestQuestion } from 'hero24-types';
import {
  DependencyId,
  OmittedDependencyIdPlainOfferRequestQuestion,
} from '../offer-request-questions.types';

export const fillQuestion = (
  question: OmittedDependencyIdPlainOfferRequestQuestion,
  questionById: Record<
    DependencyId,
    OmittedDependencyIdPlainOfferRequestQuestion
  >,
): OfferRequestQuestion => {
  switch (question.type) {
    case 'checkbox':
    case 'radio':
      return {
        ...question,
        options: question.options.map((option) => ({
          ...option,
          questions: (option.questions || []).map((questionId) =>
            fillQuestion(questionById[questionId], questionById),
          ),
        })),
      } as OfferRequestQuestion;

    default:
      return question;
  }
};
