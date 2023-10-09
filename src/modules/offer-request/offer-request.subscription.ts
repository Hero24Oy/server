import { Injectable, Logger } from '@nestjs/common';

import { subscribeOnFirebaseEvent } from '../firebase/firebase.utils';
import {
  SubscriptionService,
  Unsubscribe,
} from '../subscription-manager/subscription-manager.types';

import { OfferRequestService } from './offer-request.service';
import { createOfferRequestEventHandler } from './offer-request.utils/create-offer-request-event-handler.util';

@Injectable()
export class OfferRequestSubscription implements SubscriptionService {
  constructor(private offerRequestService: OfferRequestService) {}

  private logger = new Logger(OfferRequestSubscription.name);

  subscribe(): Unsubscribe | Promise<Unsubscribe> {
    return this.subscribeToOfferRequestUpdates();
  }

  private async subscribeToOfferRequestUpdates(): Promise<Unsubscribe> {
    return subscribeOnFirebaseEvent(
      this.offerRequestService.offerRequestTableRef,
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
