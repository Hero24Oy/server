import { DataSnapshot } from 'firebase-admin/database';
import { OfferRequestDB } from 'hero24-types';

import { OfferRequestDto } from '../dto/offer-request/offer-request.dto';

export const createOfferRequestEventHandler =
  (eventEmitter: (offer: OfferRequestDto) => void) =>
  (snapshot: DataSnapshot) => {
    try {
      if (!snapshot.key) {
        return;
      }

      const firebaseOffer: OfferRequestDB = snapshot.val();

      eventEmitter(
        OfferRequestDto.adapter.toExternal({
          ...firebaseOffer,
          id: snapshot.key,
        }),
      );
    } catch (error) {
      console.error(error);
    }
  };
