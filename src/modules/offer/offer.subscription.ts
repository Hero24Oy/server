import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reference } from 'firebase-admin/database';
import { skipFirst } from 'src/modules/common/common.utils';

import { SubscriptionService } from '../subscription-manager/subscription-manager.interface';
import { FirebaseService } from '../firebase/firebase.service';
import { subscribeOnFirebaseEvent } from '../firebase/firebase.utils';
import { createOfferEventHandler } from './offer.utils/create-offer-event-handler.util';
import { OfferService } from './offer.service';

@Injectable()
export class OfferSubscription implements SubscriptionService {
  private logger = new Logger(OfferSubscription.name);

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

  private childChangedHandler = createOfferEventHandler((offer) => {
    this.offerService.offerUpdated(offer);
  });

  private childAddedHandler = createOfferEventHandler((offer) => {
    this.offerService.offerUpdated(offer);
  });
}
