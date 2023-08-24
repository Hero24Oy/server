import { QuestionDB, QuestionOptionDB, QuestionsDB } from 'hero24-types';
import { v4 as uuidV4 } from 'uuid';

import { PlainQuestion } from '../question.types';
import { QUESTION_FLAT_ID_NAME } from '../question.constants';

const flattenQuestionsFromFirebase = (questions) => {
  const questionsArray: QuestionDB[] | QuestionOptionDB[] = [];
  for (const key in questions) {
    if (questions.hasOwnProperty(key)) {
      const question = { id: key, ...questions[key] };
      questionsArray.push(question);
    }
  }
  return questionsArray;
};

export const QuestionsToArray = (questions: QuestionsDB): PlainQuestion[] => {
  const questionsArray: QuestionDB[] | QuestionOptionDB[] =
    flattenQuestionsFromFirebase(questions);

  const subQuestions: PlainQuestion[] = [];
  const mainQuestions: PlainQuestion[] = questionsArray.map((question) => {
    switch (question.type) {
      case 'checkbox':
      case 'radio':
        const options = flattenQuestionsFromFirebase(question.options);
        return {
          ...question,
          options: options.map((option) => {
            const flattenSubQuestions = QuestionsToArray(
              option.questions || [],
            );

            const mainSubQuestions = flattenSubQuestions
              .filter((question) => !(QUESTION_FLAT_ID_NAME in question))
              .map((question) => ({
                ...question,
                [QUESTION_FLAT_ID_NAME]: uuidV4(),
              }));

            const subSubQuestions = flattenSubQuestions.filter(
              (question) => QUESTION_FLAT_ID_NAME in question,
            );

            subQuestions.push(...subSubQuestions);
            subQuestions.push(...mainSubQuestions);

            return {
              ...option,
              questions: mainSubQuestions.map(
                (question) => question[QUESTION_FLAT_ID_NAME],
              ),
            };
          }),
        };
      default:
        return question;
    }
  });

  return [...mainQuestions, ...subQuestions];
};
