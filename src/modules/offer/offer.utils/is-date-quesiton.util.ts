import { QuestionDB, OfferRequestQuestion, DateQuestionDB } from 'hero24-types';

export function isDateQuestion(
  question: QuestionDB | OfferRequestQuestion,
): question is DateQuestionDB {
  return (question as DateQuestionDB).type === 'date';
}
