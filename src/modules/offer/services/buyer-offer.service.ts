import { Injectable } from '@nestjs/common';

import { OfferIdInput } from '../dto/editing/offer-id.input';
import { OfferStatus } from '../dto/offer/offer-status.enum';

import { OfferService } from './offer.service';

import { OfferRequestService } from '$modules/offer-request/offer-request.service';

@Injectable()
export class BuyerOfferService {
  constructor(
    private readonly offerService: OfferService,
    private readonly offerRequestService: OfferRequestService,
  ) {}

  async markOfferAsSeenByBuyer(offerId: string): Promise<boolean> {
    await this.offerService.offerTableRef
      .child(offerId)
      .child('buyerData')
      .child('seenByBuyer')
      .set(true);

    return true;
  }

  async declineExtendOffer(offerId: string): Promise<boolean> {
    await this.offerService.offerTableRef
      .child(offerId)
      .child('timeToExtend')
      .set(0);

    return true;
  }

  async approveCompletedOffer(offerId: string): Promise<boolean> {
    const offer = await this.offerService.strictGetOfferById(offerId);

    if (!offer || offer.status !== 'completed') {
      throw new Error('Offer must be completed to approve');
    }

    await this.offerService.offerTableRef
      .child(offerId)
      .child('isApproved')
      .set(true);

    return true;
  }

  async approvePrepaidOffer(input: OfferIdInput): Promise<boolean> {
    const { offerId } = input;

    const offer = await this.offerService.strictGetOfferById(offerId);

    const offerRef = this.offerService.offerTableRef.child(offerId);

    await offerRef.child('status').set(OfferStatus.ACCEPTED);

    await this.offerRequestService.updateDateQuestionWithAgreedStartTime(
      offer.data.initial.offerRequestId,
      offer.data.initial.agreedStartTime,
    );

    return true;
  }
}
