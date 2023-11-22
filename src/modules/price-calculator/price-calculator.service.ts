import { Injectable } from '@nestjs/common';
import { CategoryDB } from 'hero24-types';

import { getWorkedDuration } from './price-calculator.utils';
import { getCompletedOfferDuration } from './price-calculator.utils/get-completed-offer-duration';
import { getMinimumOfferDuration } from './price-calculator.utils/get-minimum-offer-duration';
import { getPurchasedOfferDuration } from './price-calculator.utils/get-purchased-offer-duration';

import { FirebaseDatabasePath } from '$modules/firebase/firebase.constants';
import { FirebaseService } from '$modules/firebase/firebase.service';
import { FirebaseTableReference } from '$modules/firebase/firebase.types';
import { OfferService } from '$modules/offer/services/offer.service';
import { OfferRequestService } from '$modules/offer-request/offer-request.service';

// TODO add calculations
// TODO add tests
@Injectable()
export class PriceCalculatorService {
  // TODO move to service
  private readonly categoryTableRef: FirebaseTableReference<CategoryDB>;

  constructor(
    private readonly offerService: OfferService,
    private readonly offerRequestService: OfferRequestService,
    firebaseService: FirebaseService,
  ) {
    const database = firebaseService.getDefaultApp().database();

    this.categoryTableRef = database.ref(FirebaseDatabasePath.CATEGORIES);
  }

  async computePurchaseOfferById(offerId: string) {
    const offer = await this.offerService.strictGetOfferById(offerId);

    const offerRequest =
      await this.offerRequestService.strictGetOfferRequestById(
        offer.data.initial.offerRequestId,
      );

    const category = (
      await this.categoryTableRef
        .child(offerRequest.data.initial.category)
        .get()
    ).val();

    // TODO extract to category service
    if (!category) {
      throw new Error('Category does not exist');
    }

    const duration = getWorkedDuration(
      getCompletedOfferDuration(offer),
      getMinimumOfferDuration(offerRequest, category),
      getPurchasedOfferDuration(offer),
    );

    return duration;
  }
}
