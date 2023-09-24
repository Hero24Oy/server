import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OfferDB } from 'hero24-types';

import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseReference } from '../firebase/firebase.types';
import { subscribeOnFirebaseEvent } from '../firebase/firebase.utils';
import { SubscriptionService } from '../subscription-manager/subscription-manager.types';

import { createOfferEventHandler } from './offer.utils/create-offer-event-handler.util';
import { OfferService } from './services/offer.service';

import { skipFirst } from '$modules/common/common.utils';

@Injectable()
export class OfferSubscription implements SubscriptionService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly offerService: OfferService,
    protected readonly configService: ConfigService,
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

  private subscribeOnOfferCreation(
    offerRef: FirebaseReference<Record<string, OfferDB>>,
  ) {
    // Firebase child added event calls on every exist item first, than on every creation event.
    // So we should skip every exists items using limit to last 1 so as not to retrieve all items
    return subscribeOnFirebaseEvent(
      offerRef.limitToLast(1),
      'child_added',
      skipFirst(this.childAddedHandler),
    );
  }

  private subscribeOnOfferChanges(
    offerRef: FirebaseReference<Record<string, OfferDB>>,
  ) {
    return subscribeOnFirebaseEvent(
      offerRef,
      'child_changed',
      this.childChangedHandler,
    );
  }

  private childChangedHandler = createOfferEventHandler((offer) => {
    void this.offerService.offerUpdated(offer);
  });

  private childAddedHandler = createOfferEventHandler((offer) => {
    void this.offerService.offerUpdated(offer);
  });
}
