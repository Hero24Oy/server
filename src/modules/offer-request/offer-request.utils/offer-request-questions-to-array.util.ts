import { OfferRequestQuestion } from 'hero24-types';
import { v4 as uuidV4 } from 'uuid';

import {
  DependencyId,
  PlainOfferRequestQuestion,
  WithDependencyId,
} from '../offer-request-questions.types';

export const offerRequestQuestionsToArray = <Name extends string>(
  questions: OfferRequestQuestion[],
  idFieldName: Name,
): WithDependencyId<PlainOfferRequestQuestion, Name>[] => {
  const subQuestions: WithDependencyId<PlainOfferRequestQuestion, Name>[] = [];
  const mainQuestions: WithDependencyId<PlainOfferRequestQuestion, Name>[] =
    questions.map((question) => {
      switch (question.type) {
        case 'checkbox':
        case 'radio':
          return {
            ...question,
            options: question.options.map((option) => {
              const flattenSubQuestions = offerRequestQuestionsToArray(
                option.questions || [],
                idFieldName,
              );

              const mainSubQuestions = flattenSubQuestions
                .filter((question) => !(idFieldName in question))
                .map((question) => ({
                  ...question,
                  [idFieldName]: uuidV4(),
                }));

              const subSubQuestions = flattenSubQuestions.filter(
                (question) => idFieldName in question,
              );

              subQuestions.push(...subSubQuestions);
              subQuestions.push(...mainSubQuestions);

              return {
                ...option,
                questions: mainSubQuestions.map(
                  (question) =>
                    (question as Record<Name, DependencyId>)[idFieldName],
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
