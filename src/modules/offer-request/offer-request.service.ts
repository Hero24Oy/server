import { Injectable } from '@nestjs/common';
import {
  get,
  getDatabase,
  push,
  ref,
  serverTimestamp,
} from 'firebase/database';
import { OfferRequestDB } from 'hero24-types';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { OfferRequestCreationArgs } from './dto/creation/offer-request-creation.args';
import { OfferRequestDataInitialInput } from './dto/creation/offer-request-data-initial.input';
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

  async createOfferRequest(
    args: OfferRequestCreationArgs,
    app: FirebaseAppInstance,
  ): Promise<OfferRequestDto> {
    const {
      data: {
        initial,
        pickServiceProvider: { pickStrategy, preferred },
      },
      subscription,
    } = args;

    const database = getDatabase(app);

    const offerRequest: OfferRequestDB = {
      data: {
        status: 'open',
        initial: {
          ...OfferRequestDataInitialInput.convertToFirebaseType(initial),
          createdAt: serverTimestamp() as unknown as number,
        },
        pickServiceProvider: {
          pickStrategy,
          preferred: Object.fromEntries(
            preferred.map((id) => [id, true] as const),
          ),
        },
      },
      ...(subscription ? { subscription } : {}),
    };

    if (offerRequest.data.initial.questions.length === 0) {
      throw new Error('OfferRequest questions can not be empty array');
    }

    const offerRequestRef = ref(database, FirebaseDatabasePath.OFFER_REQUESTS);

    const createdRef = await push(offerRequestRef, offerRequest);

    return this.getOfferRequestById(
      createdRef.key as string,
      app,
    ) as Promise<OfferRequestDto>;
  }
}
