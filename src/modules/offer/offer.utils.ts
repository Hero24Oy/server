import { DataSnapshot } from 'firebase-admin/database';
import {
  DateQuestionDB,
  OfferDB,
  OfferRequestQuestion,
  QuestionDB,
} from 'hero24-types';

import { OfferDto } from './dto/offer/offer.dto';

export const createOfferEventHandler =
  (eventEmitter: (offer: OfferDto) => void) => (snapshot: DataSnapshot) => {
    if (!snapshot.key) {
      return;
    }

    const firebaseOffer: OfferDB = snapshot.val();

    eventEmitter(
      OfferDto.adapter.toExternal({
        ...firebaseOffer,
        id: snapshot.key,
      }),
    );
  };

export function isDateQuestion(
  question: QuestionDB | OfferRequestQuestion,
): question is DateQuestionDB {
  return (question as DateQuestionDB).type === 'date';
}
