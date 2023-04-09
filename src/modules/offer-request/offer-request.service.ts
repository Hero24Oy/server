import { Injectable } from '@nestjs/common';
import { get, getDatabase, ref } from 'firebase/database';
import { OfferRequestDB } from 'hero24-types';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { OfferRequestDto } from './dto/offer-request/offer-request.dto';

@Injectable()
export class OfferRequestService {
  async getOfferRequestById(
    offerRequestId: string,
    app: FirebaseAppInstance,
  ): Promise<OfferRequestDto | null> {
    const database = getDatabase(app);

    const path = [FirebaseDatabasePath.OFFER_REQUESTS, offerRequestId];
    const snapshot = await get(ref(database, path.join('/')));

    const offerRequest: OfferRequestDB | null = snapshot.val();

    return (
      offerRequest &&
      OfferRequestDto.convertFromFirebaseType(offerRequest, offerRequestId)
    );
  }
}
