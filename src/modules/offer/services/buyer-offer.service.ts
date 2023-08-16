import { Injectable } from '@nestjs/common';
import { OfferRequestDB } from 'hero24-types';

import { FirebaseDatabasePath } from 'src/modules/firebase/firebase.constants';
import { FirebaseService } from 'src/modules/firebase/firebase.service';

import { Questions } from '../offer.types';
import { OfferService } from './offer.service';
import { OfferAndRequestIdsInput } from '../dto/editing/offer-and-request-ids.input';

@Injectable()
export class BuyerOfferService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly offerService: OfferService,
  ) {}

  async markOfferAsSeenByBuyer(offerId: string): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    await database
      .ref(FirebaseDatabasePath.OFFERS)
      .child(offerId)
      .child('buyerData')
      .child('seenByBuyer')
      .set(true);

    return true;
  }

  async declineExtendOffer(offerId: string): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    await database
      .ref(FirebaseDatabasePath.OFFERS)
      .child(offerId)
      .child('timeToExtend')
      .set(0);

    return true;
  }

  async approveCompletedOffer(offerId: string): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offer = await this.offerService.strictGetOfferById(offerId);

    if (!offer || offer.status !== 'completed') {
      throw new Error(`Offer must be completed to approve`);
    }

    await database
      .ref(FirebaseDatabasePath.OFFERS)
      .child(offerId)
      .child('isApproved')
      .set(true);

    return true;
  }

  async approvePrepaidOffer({
    offerId,
    offerRequestId,
  }: OfferAndRequestIdsInput): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);
    const offer = await this.offerService.strictGetOfferById(offerId);

    const agreedStartTime = offer.data.initial.agreedStartTime.getTime();

    const offerRequestRef = database
      .ref(FirebaseDatabasePath.OFFER_REQUESTS)
      .child(offerRequestId);

    const offerRequest = await offerRequestRef.once('value');

    const offerRequestValues: OfferRequestDB = await offerRequest.val();
    const updatedQuestions: Questions =
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
}
