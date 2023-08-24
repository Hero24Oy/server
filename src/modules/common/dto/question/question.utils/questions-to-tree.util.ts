import { QuestionsDB } from 'hero24-types';
import {
  DependencyId,
  PlainQuestion,
  OmittedDependencyIdPlainQuestion,
} from '../question.types';
import { fillQuestion } from './fill-question.util';
import { omit } from 'lodash';
import { QUESTION_FLAT_ID_NAME } from '../question.constants';

export const questionsToTree = (questions: PlainQuestion[]): QuestionsDB => {
  const finalQuestions: QuestionsDB = {};
  const mainQuestions: PlainQuestion[] = [];

  const questionById: Record<DependencyId, OmittedDependencyIdPlainQuestion> =
    {};

  questions.forEach((question) => {
    const dependencyId = question[QUESTION_FLAT_ID_NAME];

    if (typeof dependencyId === 'string') {
      questionById[dependencyId] = omit(
        question,
        QUESTION_FLAT_ID_NAME,
      ) as OmittedDependencyIdPlainQuestion;
    } else {
      mainQuestions.push(question);
    }
  });

  mainQuestions.forEach((question) => {
    finalQuestions[question.id] = fillQuestion(question, questionById);
  });

  return finalQuestions;
};
