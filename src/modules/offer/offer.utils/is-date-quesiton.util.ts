import { QuestionDB, OfferRequestQuestion, DateQuestionDB } from 'hero24-types';
import { OfferRequestQuestionType } from 'src/modules/offer-request/offer-request-question/offer-request-question.constants';

export function isDateQuestion(
  question: QuestionDB | OfferRequestQuestion,
): question is DateQuestionDB {
  return (question as DateQuestionDB).type === OfferRequestQuestionType.DATE;
}
