import { Injectable } from '@nestjs/common';
import { OfferDB } from 'hero24-types';

import { FirebaseReference } from '../firebase/firebase.types';
import { subscribeOnFirebaseEvent } from '../firebase/firebase.utils';
import {
  SubscriptionService,
  Unsubscribe,
} from '../subscription-manager/subscription-manager.types';

import { createOfferEventHandler } from './offer.utils/create-offer-event-handler.util';
import { OfferService } from './services/offer.service';

import { ConfigType } from '$config';
import { Config } from '$decorator';
import { skipFirst } from '$modules/common/common.utils';

@Injectable()
export class OfferSubscription implements SubscriptionService {
  constructor(
    private readonly offerService: OfferService,
    @Config() protected readonly config: ConfigType,
  ) {}

  public subscribe(): Unsubscribe {
    const { offerTableRef } = this.offerService;

    const unsubscribes = [
      this.subscribeOnOfferCreation(offerTableRef),
      this.subscribeOnOfferChanges(offerTableRef),
    ];

    return (): void => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }

  private subscribeOnOfferCreation(
    offerRef: FirebaseReference<Record<string, OfferDB>>,
  ): () => void {
    // Firebase child added event calls on every exist item first, than on every creation event.
    // So we should skip every exists items using limit to last 1 so as not to retrieve all items
    // !IMPORTANT
    // * limitToLast(1) retrieves from database only the last item
    // * Items are ordered by key by default so if added node is not the last one, this event won't trigger
    // * Using firebase push() method to create node ensures that this item will be the last one
    return subscribeOnFirebaseEvent(
      offerRef.limitToLast(1),
      'child_added',
      skipFirst(this.childAddedHandler),
    );
  }

  private subscribeOnOfferChanges(
    offerRef: FirebaseReference<Record<string, OfferDB>>,
  ): () => void {
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
