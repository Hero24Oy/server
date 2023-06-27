import { Injectable } from '@nestjs/common';
import { get, getDatabase, push, ref } from 'firebase/database';
import { OfferRequestDB, OfferRequestSubscription } from 'hero24-types';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { OfferRequestCreationArgs } from './dto/creation/offer-request-creation.args';
import { OfferRequestDataInput } from './dto/creation/offer-request-data.input';
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

    const offerRequestDto = new OfferRequestDto();

    if (!offerRequest) {
      return null;
    }

    return offerRequestDto.fromFirebase({
      ...offerRequest,
      id: offerRequestId,
    });
  }

  async createOfferRequest(
    args: OfferRequestCreationArgs,
    app: FirebaseAppInstance,
  ): Promise<OfferRequestDto> {
    const {
      data,
      subscription,
      serviceProviderVAT,
      customerVat,
      minimumDuration,
    } = args;

    const database = getDatabase(app);

    const offerRequest: Omit<OfferRequestDB, 'subscription'> & {
      subscription?: Pick<OfferRequestSubscription, 'subscriptionType'>;
    } = {
      data: OfferRequestDataInput.convertToFirebaseType(data),
      ...(subscription ? { subscription } : {}),
      ...(serviceProviderVAT ? { serviceProviderVAT } : {}),
      ...(customerVat ? { customerVat } : {}),
      ...(minimumDuration ? { minimumDuration } : {}),
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
