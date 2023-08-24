import { QuestionDB } from 'hero24-types';
import {
  DependencyId,
  OmittedDependencyIdPlainQuestion,
} from '../question.types';

export const fillQuestion = (
  question: OmittedDependencyIdPlainQuestion,
  questionById: Record<DependencyId, OmittedDependencyIdPlainQuestion>,
): QuestionDB => {
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
      } as any;

    default:
      return question;
  }
};
