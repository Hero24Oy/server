import { isString } from 'lodash';
import { Injectable } from '@nestjs/common';
import { get, getDatabase, push, ref } from 'firebase/database';
import { OfferRequestDB, OfferRequestSubscription } from 'hero24-types';

import { OfferRequestDataInput } from './dto/creation/offer-request-data.input';
import { OfferRequestCreationArgs } from './dto/creation/offer-request-creation.args';
import { OfferRequestDto } from './dto/offer-request/offer-request.dto';
import { OfferRequestPurchaseInput } from './dto/offer-request-purchase/offer-request-purchase.input';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class OfferRequestService {
  constructor(private firebaseService: FirebaseService) {}

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

  async getCategoryIdByOfferRequestId(
    offerRequestId: string,
  ): Promise<string | null> {
    const database = this.firebaseService.getDefaultApp().database();

    const categorySnapshot = await database
      .ref(FirebaseDatabasePath.OFFER_REQUESTS)
      .child(offerRequestId)
      .child('data')
      .child('initial')
      .child('category')
      .get();

    const category: string | null = categorySnapshot.val();

    return category;
  }

  async strictGetCategoryIdByOfferRequestId(
    offerRequestId: string,
  ): Promise<string> {
    const category = await this.getCategoryIdByOfferRequestId(offerRequestId);

    if (!isString(category)) {
      throw new Error(
        `Category was not found for offer request with id ${offerRequestId}`,
      );
    }

    return category;
  }

  async getBuyerIdByOfferRequestId(
    offerRequestId: string,
  ): Promise<string | null> {
    const database = this.firebaseService.getDefaultApp().database();

    const buyerIdSnapshot = await database
      .ref(FirebaseDatabasePath.OFFER_REQUESTS)
      .child(offerRequestId)
      .child('data')
      .child('initial')
      .child('buyerProfile')
      .get();

    const buyerId: string | null = buyerIdSnapshot.val();

    return buyerId;
  }

  async strictGetBuyerIdByOfferRequestId(
    offerRequestId: string,
  ): Promise<string> {
    const buyerId = await this.getBuyerIdByOfferRequestId(offerRequestId);

    if (!buyerId) {
      throw new Error(
        `Buyer id was not found for offer request ${offerRequestId}`,
      );
    }

    return buyerId;
  }

  async getFeeIdsByOfferRequestId(offerRequestId: string): Promise<string[]> {
    const database = this.firebaseService.getDefaultApp().database();

    const feesSnapshot = await database
      .ref(FirebaseDatabasePath.OFFER_REQUESTS)
      .child(offerRequestId)
      .child('fees')
      .get();

    const fees: Record<string, true> | null = feesSnapshot.val();

    return Object.keys(fees || {});
  }

  async updatePurchase(purchase: OfferRequestPurchaseInput): Promise<true> {
    const { id, fixedPrice, fixedDuration } = purchase;

    try {
      const database = this.firebaseService.getDefaultApp().database();

      await database
        .ref(FirebaseDatabasePath.OFFER_REQUESTS)
        .child(id)
        .child('data')
        .child('initial')
        .update({ fixedPrice, fixedDuration });
    } catch {
      throw new Error('Purchase update failed');
    }

    return true;
  }
}
