import { Injectable } from '@nestjs/common';
import { OfferDB, OfferRequestDB } from 'hero24-types';

import { FirebaseService } from '../firebase/firebase.service';
import { OfferDto } from './dto/offer/offer.dto';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { MaybeType } from '../common/common.types';

@Injectable()
export class OfferService {
  constructor(private firebaseService: FirebaseService) {}

  async getOfferById(offerId: string): Promise<OfferDto | null> {
    const database = this.firebaseService.getDefaultApp().database();

    const snapshot = await database
      .ref(FirebaseDatabasePath.OFFERS)
      .child(offerId)
      .get();

    const offer: OfferDB | null = snapshot.val();

    return offer && OfferDto.adapter.toExternal({ id: offerId, ...offer });
  }

  async strictGetOfferById(offerId: string): Promise<OfferDto> {
    const offer = await this.getOfferById(offerId);

    if (!offer) {
      throw new Error(`Offer with id ${offerId} was not found`);
    }

    return offer;
  }

  async setHubSpotDealId(offerId: string, dealId: string | null) {
    const database = this.firebaseService.getDefaultApp().database();

    await database
      .ref(FirebaseDatabasePath.OFFERS)
      .child(offerId)
      .child('hubSpotDealId')
      .set(dealId);
  }

  async markOfferAsSeen(offerId: string): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);
    await offerRef.child('buyerData').child('seenByBuyer').set(true);

    return true;
  }

  async declineExtendOffer(offerId: string): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);
    await offerRef.child('timeToExtend').set(0);

    return true;
  }

  async approvePrepaidOffer(
    offerId: string,
    offerRequestId: string,
  ): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);
    const offerSnapshot = await offerRef.once('value');
    const offer: OfferDB = offerSnapshot.val();

    const agreedStartTime: MaybeType<
      OfferDB['data']['initial']['agreedStartTime']
    > = offer.data.initial.agreedStartTime;

    if (!agreedStartTime) {
      throw new Error('Could not find offered time! (should never happen)');
    }

    const offerRequestRef = database
      .ref(FirebaseDatabasePath.OFFER_REQUESTS)
      .child(offerRequestId);
    const offerRequestSnapshot = await offerRequestRef.once('value');

    if (!offerRequestSnapshot.exists()) {
      throw new Error('OfferRequest not found! (should never happen)');
    }

    const offerRequestValues: OfferRequestDB = await offerRequestSnapshot.val();

    const updatedQuestions: OfferRequestDB['data']['initial']['questions'] =
      offerRequestValues.data.initial.questions.map((question) => {
        if (question.type === 'date') {
          question.preferredTime = agreedStartTime;
          question.suitableTimes = null;
          question.suitableTimesCount = null;
        }
        return question;
      });

    await offerRequestRef
      .child('data')
      .child('initial')
      .child('questions')
      .set(updatedQuestions);

    await offerRef.child('status').set('accepted');

    return true;
  }

  async approveCompletedOffer(
    offerId: string,
    offerRequestId: string,
  ): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);
    const offerSnapshot = await offerRef.once('value');
    const offer: OfferDB = offerSnapshot.val();

    if (!offer || offer.status !== 'completed') {
      throw new Error(`Offer must be completed to approve`);
    }

    const offerRequestRef = database
      .ref(FirebaseDatabasePath.OFFER_REQUESTS)
      .child(offerRequestId);

    const offerRequest = await offerRequestRef.once('value');

    if (!offerRequest.exists()) {
      throw new Error('OfferRequest not found! (should never happen)');
    }

    await offerRef.child('isApproved').set(true);

    return true;
  }
}
