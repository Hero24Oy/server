import { DateQuestionDB, OfferRequestQuestion, QuestionDB } from 'hero24-types';

import { OfferRequestQuestionType } from '$modules/offer-request/offer-request-question/dto/offer-request-question/offer-request-question-type.enum';

export function isDateQuestion(
  question: QuestionDB | OfferRequestQuestion,
): question is DateQuestionDB {
  return (question as DateQuestionDB).type === OfferRequestQuestionType.DATE;
}
