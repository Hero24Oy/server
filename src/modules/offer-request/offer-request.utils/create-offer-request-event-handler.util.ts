import { OfferRequestDB } from 'hero24-types';

import { OfferRequestDto } from '../dto/offer-request/offer-request.dto';

import { FirebaseSnapshot } from '$/modules/firebase/firebase.types';

export const createOfferRequestEventHandler =
  (eventEmitter: (offerRequest: OfferRequestDto) => void) =>
  (snapshot: FirebaseSnapshot<OfferRequestDB>) => {
    try {
      const offerRequest = snapshot.val();

      if (!snapshot.key || !offerRequest) {
        return;
      }

      eventEmitter(
        OfferRequestDto.adapter.toExternal({
          ...offerRequest,
          id: snapshot.key,
        }),
      );
    } catch (error) {
      console.error(error);
    }
  };
