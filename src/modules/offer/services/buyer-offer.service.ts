import { Injectable } from '@nestjs/common';

import { FirebaseDatabasePath } from 'src/modules/firebase/firebase.constants';
import { FirebaseService } from 'src/modules/firebase/firebase.service';

import { OfferService } from './offer.service';
import { OfferIdInput } from '../dto/editing/offer-id.input';
import { OfferStatus } from '../dto/offer/offer-status.enum';

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

  async approvePrepaidOffer({ offerId }: OfferIdInput): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);

    await offerRef.child('status').set(OfferStatus.ACCEPTED);

    return true;
  }
}
