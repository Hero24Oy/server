import { OfferRequestQuestion } from 'hero24-types';

import { OfferRequestQuestionType } from '../dto/offer-request-question/offer-request-question-type.enum';
import {
  DependencyId,
  OmittedDependencyIdPlainOfferRequestQuestion,
} from '../offer-request-question.types';

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
