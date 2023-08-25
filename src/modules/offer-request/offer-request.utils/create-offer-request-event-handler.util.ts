import { OfferRequestDto } from '../dto/offer-request/offer-request.dto';
import { DataSnapshot } from 'firebase-admin/database';
import { OfferRequestDB } from 'hero24-types';

export const createOfferRequestEventHandler =
  (eventEmitter: (offer: OfferRequestDto) => void) =>
  (snapshot: DataSnapshot) => {
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
  };
