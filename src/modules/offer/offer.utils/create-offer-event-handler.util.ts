import { OfferDB } from 'hero24-types';
import { DataSnapshot } from 'firebase-admin/database';

import { OfferDto } from '../dto/offer/offer.dto';

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
