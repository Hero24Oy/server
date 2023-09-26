import { OfferDB } from 'hero24-types';

import { OfferDto } from '../dto/offer/offer.dto';

import { FirebaseSnapshot } from '$/modules/firebase/firebase.types';

export const createOfferEventHandler =
  (eventEmitter: (offer: OfferDto) => void) =>
  (snapshot: FirebaseSnapshot<OfferDB>): void => {
    const offer = snapshot.val();

    if (!snapshot.key || !offer) {
      return;
    }

    eventEmitter(OfferDto.adapter.toExternal({ ...offer, id: snapshot.key }));
  };
