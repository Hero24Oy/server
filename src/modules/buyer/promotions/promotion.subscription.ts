import { Injectable } from '@nestjs/common';
import { Reference } from 'firebase-admin/database';

import { skipFirst } from '../../common/common.utils';
import { FirebaseService } from '../../firebase/firebase.service';
import { FirebaseDatabasePath } from '../../firebase/firebase.constants';
import { subscribeOnFirebaseEvent } from '../../firebase/firebase.utils';
import { SubscriptionService } from '../../subscription-manager/subscription-manager.interface';
import { createPromotionsEventHandler } from './promotion.utils/create-promotion-event-handler.util';
import { PromotionService } from './promotion.service';

@Injectable()
export class PromotionSubscription implements SubscriptionService {
  constructor(
    private readonly promotionService: PromotionService,
    private readonly firebaseService: FirebaseService,
  ) {}

  public subscribe() {
    const promotionsRef = this.firebaseService
      .getDefaultApp()
      .database()
      .ref(FirebaseDatabasePath.PROMOTIONS);

    const unsubscribes = [
      this.subscribeOnPromotionCreation(promotionsRef),
      this.subscribeOnPromotionUpdated(promotionsRef),
      this.subscribeOnPromotionRemoved(promotionsRef),
    ];

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }

  private subscribeOnPromotionCreation(promotionRef: Reference) {
    return subscribeOnFirebaseEvent(
      promotionRef.limitToLast(1),
      'child_added',
      skipFirst(this.childAddedHandler),
    );
  }

  private subscribeOnPromotionUpdated(promotionRef: Reference) {
    return subscribeOnFirebaseEvent(
      promotionRef,
      'child_changed',
      this.childUpdatedHandler,
    );
  }

  private subscribeOnPromotionRemoved(promotionRef: Reference) {
    return subscribeOnFirebaseEvent(
      promotionRef,
      'child_removed',
      this.childRemovedHandler,
    );
  }

  private childAddedHandler = createPromotionsEventHandler((offer) => {
    this.promotionService.promotionAdded(offer);
  });

  private childUpdatedHandler = createPromotionsEventHandler((offer) => {
    this.promotionService.promotionUpdated(offer);
  });

  private childRemovedHandler = createPromotionsEventHandler((offer) => {
    this.promotionService.promotionRemoved(offer);
  });
}
