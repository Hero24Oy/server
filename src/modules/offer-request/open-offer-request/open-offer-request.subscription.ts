import { Injectable, Logger } from '@nestjs/common';
import { DataSnapshot } from 'firebase-admin/database';

import { Unsubscribe } from 'src/modules/subscription-manager/subscription-manager.types';
import { SubscriptionService } from 'src/modules/subscription-manager/subscription-manager.interface';
import { subscribeOnFirebaseEvent } from 'src/modules/firebase/firebase.utils';

import { OpenOfferRequestService } from './open-offer-request.service';
import { skipFirst } from 'src/modules/common/common.utils';

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
      this.openOfferRequestService.getOpenOfferRequestsRef(),
      'child_removed',
      this.childRemovedHandler,
    );
  }

  private async subscribeToOpenOfferRequestAddition() {
    return subscribeOnFirebaseEvent(
      // Firebase child added event calls on every exist item first, than on every creation event.
      // So we should skip every exists items using limit to last 1 so as not to retrieve all items
      this.openOfferRequestService.getOpenOfferRequestsRef().limitToLast(1),
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

      this.openOfferRequestService.emitOpenOfferRequestListItemAdded(
        snapshot.key,
      );
    } catch (error) {
      this.logger.error(error);
    }
  };
}
