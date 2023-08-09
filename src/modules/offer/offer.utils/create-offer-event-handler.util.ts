import { OfferDB } from 'hero24-types';

import { OfferDto } from '../dto/offer/offer.dto';
import { DataSnapshot } from 'firebase-admin/database';

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
