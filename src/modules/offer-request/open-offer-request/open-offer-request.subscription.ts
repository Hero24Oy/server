import { Injectable, Logger } from '@nestjs/common';
import { DataSnapshot } from 'firebase-admin/database';

import { OpenOfferRequestService } from './open-offer-request.service';

import { skipFirst } from '$modules/common/common.utils';
import { subscribeOnFirebaseEvent } from '$modules/firebase/firebase.utils';
import {
  SubscriptionService,
  Unsubscribe,
} from '$modules/subscription-manager/subscription-manager.types';

@Injectable()
export class OpenOfferRequestSubscription implements SubscriptionService {
  constructor(
    private readonly openOfferRequestService: OpenOfferRequestService,
  ) {}

  private readonly logger = new Logger(OpenOfferRequestSubscription.name);

  async subscribe(): Promise<Unsubscribe> {
    const unsubscribes = await Promise.all([
      this.subscribeToOpenOfferRequestRemoval(),
      this.subscribeToOpenOfferRequestAddition(),
    ]);

    return async () => {
      await Promise.all(unsubscribes.map((unsubscribe) => unsubscribe()));
    };
  }

  private async subscribeToOpenOfferRequestRemoval() {
    return subscribeOnFirebaseEvent(
      this.openOfferRequestService.openOfferRequestTableRef,
      'child_removed',
      this.childRemovedHandler,
    );
  }

  private async subscribeToOpenOfferRequestAddition() {
    return subscribeOnFirebaseEvent(
      // Firebase child added event calls on every exist item first, than on every creation event.
      // So we should skip every exists items using limit to last 1 so as not to retrieve all items
      // !IMPORTANT
      // * limitToLast(1) retrieves from database only the last item
      // * Items are ordered by key by default so if added node is not the last one, this event won't trigger
      // * Using firebase push() method to create node ensures that this item will be the last one
      this.openOfferRequestService.openOfferRequestTableRef.limitToLast(1),
      'child_added',
      skipFirst(this.childAddedHandler),
    );
  }

  private childRemovedHandler = (snapshot: DataSnapshot) => {
    try {
      if (!snapshot.key) {
        return;
      }

      this.openOfferRequestService.emitOpenOfferRequestListItemRemoved(
        snapshot.key,
      );
    } catch (error) {
      this.logger.error(error);
    }
  };

  private childAddedHandler = (snapshot: DataSnapshot) => {
    try {
      if (!snapshot.key) {
        return;
      }

      void this.openOfferRequestService.emitOpenOfferRequestListItemAdded(
        snapshot.key,
      );
    } catch (error) {
      this.logger.error(error);
    }
  };
}
