import { Injectable } from '@nestjs/common';
import { OfferDB } from 'hero24-types';

import { FirebaseService } from '../firebase/firebase.service';
import { OfferDto } from './dto/offer/offer.dto';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { OfferRequestService } from '../offer-request/offer-request.service';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { OfferExtendInput } from './dto/editing/offer-extend.input';

@Injectable()
export class OfferService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly offerRequestService: OfferRequestService,
  ) {}

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

  async approveCompletedOffer(
    offerId: string,
    offerRequestId: string,
    app: FirebaseAppInstance,
  ): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);
    const offer = await this.strictGetOfferById(offerId);

    if (!offer || offer.status !== 'completed') {
      throw new Error(`Offer must be completed to approve`);
    }

    const offerRequest = await this.offerRequestService.getOfferRequestById(
      offerRequestId,
      app,
    );

    if (offerRequest) {
      throw new Error('OfferRequest not found! (should never happen)');
    }

    await offerRef.child('isApproved').set(true);

    return true;
  }

  async cancelRequestToExtend(offerId: string): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);

    await offerRef.update({
      timeToExtend: null,
      reasonToExtend: null,
    });

    return true;
  }

  async extendOfferDuration(
    offerId: string,
    args: OfferExtendInput,
  ): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);

    await offerRef.update({
      timeToExtend: args.extendedDuration,
      reasonToExtend: args.reasonToExtend,
    });

    return true;
  }
}
