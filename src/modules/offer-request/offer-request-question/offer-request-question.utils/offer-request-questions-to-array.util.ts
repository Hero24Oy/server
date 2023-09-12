import { OfferRequestQuestion } from 'hero24-types';
import { v4 as uuidV4 } from 'uuid';

import {
  OfferRequestQuestionType,
  QUESTION_FLAT_ID_NAME,
} from '../offer-request-question.constants';
import { PlainOfferRequestQuestion } from '../offer-request-question.types';

export const offerRequestQuestionsToArray = (
  questions: OfferRequestQuestion[],
): PlainOfferRequestQuestion[] => {
  const subQuestions: PlainOfferRequestQuestion[] = [];

  const mainQuestions: PlainOfferRequestQuestion[] = questions.map(
    (offerRequestQuestion) => {
      switch (offerRequestQuestion.type) {
        case OfferRequestQuestionType.CHECKBOX:
        case OfferRequestQuestionType.RADIO:
          return {
            ...offerRequestQuestion,
            options: offerRequestQuestion.options.map((option) => {
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
          return offerRequestQuestion;
      }
    },
  );

  return [...mainQuestions, ...subQuestions];
};
