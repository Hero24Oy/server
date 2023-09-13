import { OfferRequestQuestion } from 'hero24-types';
import { v4 as uuidV4 } from 'uuid';

import { PlainOfferRequestQuestion } from '../offer-request-question.types';
import {
  OfferRequestQuestionType,
  QUESTION_FLAT_ID_NAME,
} from '../offer-request-question.constants';

export const offerRequestQuestionsToArray = (
  questions: OfferRequestQuestion[],
): PlainOfferRequestQuestion[] => {
  const subQuestions: PlainOfferRequestQuestion[] = [];
  const mainQuestions: PlainOfferRequestQuestion[] = questions.map(
    (question) => {
      switch (question.type) {
        case OfferRequestQuestionType.CHECKBOX:
        case OfferRequestQuestionType.RADIO:
          return {
            ...question,
            options: question.options.map((option) => {
              const flattenSubQuestions = offerRequestQuestionsToArray(
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
    },
  );

  return [...mainQuestions, ...subQuestions];
};