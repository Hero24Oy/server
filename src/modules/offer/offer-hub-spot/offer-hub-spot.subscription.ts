import { Injectable, Logger } from '@nestjs/common';
import { OfferDB } from 'hero24-types';

import { SubscriptionService } from '../../subscription-manager/subscription-manager.interface';
import { OfferDto } from '../dto/offer/offer.dto';
import { subscribeOnFirebaseEvent } from '../../firebase/firebase.utils';
import { FirebaseService } from '../../firebase/firebase.service';
import { OfferHubSpotService } from './offer-hub-spot.service';

@Injectable()
export class OfferHubSpotSubscription implements SubscriptionService {
  private logger = new Logger(OfferHubSpotSubscription.name);

  constructor(
    private firebaseService: FirebaseService,
    private offerHubSpotService: OfferHubSpotService,
  ) {}

  public subscribe() {
    const offerRef = this.firebaseService
      .getDefaultApp()
      .database()
      .ref('offers')
      .limitToLast(1);

    let lastSkipped = false;

    return subscribeOnFirebaseEvent(
      offerRef,
      'child_added',
      async (snapshot) => {
        try {
          if (!lastSkipped) {
            lastSkipped = true;
            return;
          }

          const firebaseOffer: OfferDB = snapshot.val();
          const offerId = snapshot.key;

          if (!offerId) {
            return;
          }

          const offer = OfferDto.adapter.toExternal({
            ...firebaseOffer,
            id: offerId,
          });

          await this.offerHubSpotService.createDeal(offer);
        } catch (err) {
          this.logger.error(err);
        }
      },
    );
  }
}
