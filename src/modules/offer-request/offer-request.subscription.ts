import { Injectable, Logger } from '@nestjs/common';

import { SubscriptionService } from '../subscription-manager/subscription-manager.interface';
import { Unsubscribe } from '../subscription-manager/subscription-manager.types';
import { OfferRequestService } from './offer-request.service';
import { subscribeOnFirebaseEvent } from '../firebase/firebase.utils';
import { createOfferRequestEventHandler } from './offer-request.utils/create-offer-request-event-handler.util';

@Injectable()
export class OfferRequestSubscription implements SubscriptionService {
  constructor(private offerRequestService: OfferRequestService) {}

  private logger = new Logger(OfferRequestSubscription.name);

  subscribe(): Unsubscribe | Promise<Unsubscribe> {
    return this.subscribeToOfferRequestUpdates();
  }

  private async subscribeToOfferRequestUpdates() {
    return subscribeOnFirebaseEvent(
      this.offerRequestService.getOfferRequestsRef(),
      'child_changed',
      this.childChangedHandler,
    );
  }

  childChangedHandler = createOfferRequestEventHandler((offerRequest) => {
    try {
      this.offerRequestService.emitOfferRequestUpdated(offerRequest);
    } catch (error) {
      this.logger.error(error);
    }
  });
}
