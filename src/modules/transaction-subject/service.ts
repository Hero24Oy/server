import { Injectable } from '@nestjs/common';
import {
  PaymentTransaction,
  PaymentTransactionSubjectType,
} from 'hero24-types';

import { BuyerService } from '../buyer/buyer.service';

import { BuyerProfileDto } from '$modules/buyer/dto/buyer/buyer-profile.dto';
import { FeeService } from '$modules/fee/fee.service';
import { OfferService } from '$modules/offer/services/offer.service';
import { OfferRequestService } from '$modules/offer-request/offer-request.service';

@Injectable()
export class TransactionSubjectService {
  constructor(
    private readonly feeService: FeeService,
    private readonly taskRequestService: OfferRequestService,
    private readonly taskService: OfferService,
    private readonly customerService: BuyerService,
  ) {}

  async strictGetCustomerBySubject(
    params: Pick<PaymentTransaction, 'subjectId' | 'subjectType'>,
  ): Promise<BuyerProfileDto> {
    const { subjectId, subjectType } = params;

    let buyerId: string;

    if (subjectType === PaymentTransactionSubjectType.TASK) {
      const offerRequest =
        await this.taskRequestService.strictGetOfferRequestById(subjectId);

      buyerId = offerRequest?.data.initial.buyerProfile;
    } else if (subjectType === PaymentTransactionSubjectType.FEE) {
      const fee = await this.feeService.strictGetFeeById(subjectId);

      buyerId = fee.userId;
    } else {
      const [offerId] = subjectId.split('//');

      const offer = await this.taskService.strictGetOfferById(offerId);

      buyerId = offer.data.initial.buyerProfileId;
    }

    return this.customerService.strictGetBuyerProfileById(buyerId);
  }
}
