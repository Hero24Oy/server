import { Injectable } from '@nestjs/common';
import {
  PaymentTransaction,
  PaymentTransactionSubjectType,
} from 'hero24-types';

import { FeeService } from '$modules/fee/fee.service';
import { OfferService } from '$modules/offer/services/offer.service';
import { OfferRequestService } from '$modules/offer-request/offer-request.service';

@Injectable()
export class TransactionSubjectService {
  constructor(
    private readonly feeService: FeeService,
    private readonly offerRequestService: OfferRequestService,
    private readonly offerService: OfferService,
  ) {}

  async getCustomerIdBySubject(
    props: Pick<PaymentTransaction, 'subjectId' | 'subjectType'>,
  ): Promise<string | null> {
    const { subjectId, subjectType } = props;

    let buyerId: string;

    if (subjectType === PaymentTransactionSubjectType.TASK) {
      const offerRequest = await this.offerRequestService.getOfferRequestById(
        subjectId,
      );

      if (!offerRequest) {
        return null;
      }

      buyerId = offerRequest?.data.initial.buyerProfile;
    } else if (subjectType === PaymentTransactionSubjectType.FEE) {
      const fee = await this.feeService.getFeeById(subjectId);

      if (!fee) {
        return null;
      }

      buyerId = fee.userId;
    } else {
      const [offerId] = subjectId.split('//');

      const offer = await this.offerService.getOfferById(offerId);

      if (!offer) {
        return null;
      }

      buyerId = offer.data.initial.buyerProfileId;
    }

    return buyerId;
  }
}
