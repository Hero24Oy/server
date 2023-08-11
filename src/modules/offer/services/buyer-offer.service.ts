import { Injectable } from '@nestjs/common';
import { OfferRequestDB } from 'hero24-types';

import { FirebaseDatabasePath } from 'src/modules/firebase/firebase.constants';
import { FirebaseService } from 'src/modules/firebase/firebase.service';

import { Questions } from '../offer.types';
import { CommonOfferService } from './common-offer.service';

@Injectable()
export class BuyerOfferService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly commonOfferService: CommonOfferService,
  ) {}

  async markOfferAsSeenByBuyer(offerId: string): Promise<boolean> {
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

  async approveCompletedOffer(offerId: string): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);
    const offer = await this.commonOfferService.strictGetOfferById(offerId);

    if (!offer || offer.status !== 'completed') {
      throw new Error(`Offer must be completed to approve`);
    }

    await offerRef.child('isApproved').set(true);

    return true;
  }

  async approvePrepaidOffer(
    offerId: string,
    offerRequestId: string,
  ): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);
    const offer = await this.commonOfferService.strictGetOfferById(offerId);

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

    console.log('approving');
    await offerRef.child('status').set('accepted');

    return true;
  }
}
