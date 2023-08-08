import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reference } from 'firebase-admin/database';
import { skipFirst } from 'src/modules/common/common.utils';

import { HubSpotSubscription } from 'src/modules/hub-spot/hub-spot-subscription.interface';

import { subscribeOnFirebaseEvent } from '../../firebase/firebase.utils';
import { FirebaseService } from '../../firebase/firebase.service';
import { createOfferEventHandler } from '../offer.utils/create-offer-event-handler.util';
import { OfferHubSpotService } from './offer-hub-spot.service';

@Injectable()
export class OfferHubSpotSubscription extends HubSpotSubscription {
  private logger = new Logger(OfferHubSpotSubscription.name);

  constructor(
    private firebaseService: FirebaseService,
    private offerHubSpotService: OfferHubSpotService,
    protected configService: ConfigService,
  ) {
    super();
  }

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
    return subscribeOnFirebaseEvent(
      offerRef.limitToLast(1),
      'child_added',
      skipFirst(this.childAddedHandler),
    );
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
