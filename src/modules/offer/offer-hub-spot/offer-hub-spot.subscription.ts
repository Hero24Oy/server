import { Injectable, Logger } from '@nestjs/common';

import { SubscriptionService } from '../../subscription-manager/subscription-manager.interface';
import { subscribeOnFirebaseEvent } from '../../firebase/firebase.utils';
import { FirebaseService } from '../../firebase/firebase.service';
import { OfferHubSpotService } from './offer-hub-spot.service';
import { createOfferEventHandler } from '../offer.utils';
import { Reference } from 'firebase-admin/database';

@Injectable()
export class OfferHubSpotSubscription implements SubscriptionService {
  private logger = new Logger(OfferHubSpotSubscription.name);

  constructor(
    private firebaseService: FirebaseService,
    private offerHubSpotService: OfferHubSpotService,
  ) {}

  public subscribe() {
    const offerRef = this.firebaseService
      .getDefaultApp()
      .database()
      .ref('offers');

    const unsubscribes = [
      this.subscribeOnOfferCreation(offerRef),
      this.subscribeOnOfferChanges(offerRef),
    ];

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }

  private subscribeOnOfferCreation(offerRef: Reference) {
    // Firebase child added event calls on every exist item first, than on every creation event.
    // So we should skip every exists items using limit to last 1 so as not to retrieve all items
    const offerQuery = offerRef.limitToLast(1);

    let lastSkipped = false;

    return subscribeOnFirebaseEvent(offerQuery, 'child_added', (snapshot) => {
      if (!lastSkipped) {
        lastSkipped = true;
        return;
      }

      this.childAddedHandler(snapshot);
    });
  }

  private subscribeOnOfferChanges(offerRef: Reference) {
    return subscribeOnFirebaseEvent(
      offerRef,
      'child_changed',
      this.childChangedHandler,
    );
  }

  private childChangedHandler = createOfferEventHandler(async (offer) => {
    try {
      if (!offer.hubSpotDealId) {
        return;
      }

      await this.offerHubSpotService.updateDeal(offer);
    } catch (err) {
      this.logger.error(err);
    }
  });

  private childAddedHandler = createOfferEventHandler(async (offer) => {
    try {
      await this.offerHubSpotService.createDeal(offer);
    } catch (err) {
      this.logger.error(err);
    }
  });
}
