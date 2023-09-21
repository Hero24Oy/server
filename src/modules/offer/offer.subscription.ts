import { Inject, Injectable } from '@nestjs/common';
import { Reference } from 'firebase-admin/database';

import { FirebaseService } from '../firebase/firebase.service';
import { subscribeOnFirebaseEvent } from '../firebase/firebase.utils';
import {
  SubscriptionService,
  Unsubscribe,
} from '../subscription-manager/subscription-manager.types';

import { createOfferEventHandler } from './offer.utils/create-offer-event-handler.util';
import { OfferService } from './services/offer.service';

import { Config, configProvider } from '$config';
import { skipFirst } from '$modules/common/common.utils';

@Injectable()
export class OfferSubscription implements SubscriptionService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly offerService: OfferService,
    @Inject(configProvider)
    protected readonly config: Config,
  ) {}

  public subscribe(): Unsubscribe {
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

  private subscribeOnOfferCreation(offerRef: Reference): () => void {
    // Firebase child added event calls on every exist item first, than on every creation event.
    // So we should skip every exists items using limit to last 1 so as not to retrieve all items
    return subscribeOnFirebaseEvent(
      offerRef.limitToLast(1),
      'child_added',
      skipFirst(this.childAddedHandler),
    );
  }

  private subscribeOnOfferChanges(offerRef: Reference): () => void {
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
