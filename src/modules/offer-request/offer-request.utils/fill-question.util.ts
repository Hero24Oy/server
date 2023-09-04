import { OfferRequestQuestion } from 'hero24-types';
import {
  DependencyId,
  OmittedDependencyIdPlainOfferRequestQuestion,
} from '../offer-request-questions.types';
import { OfferRequestQuestionType } from '../offer-request.constants';

export const fillQuestion = (
  question: OmittedDependencyIdPlainOfferRequestQuestion,
  questionById: Record<
    DependencyId,
    OmittedDependencyIdPlainOfferRequestQuestion
  >,
): OfferRequestQuestion => {
  switch (question.type) {
    case OfferRequestQuestionType.CHECKBOX:
    case OfferRequestQuestionType.RADIO:
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
