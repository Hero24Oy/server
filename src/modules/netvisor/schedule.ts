import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PaidStatus } from 'hero24-types';

import { UPDATE_PAID_STATUS_CRON_TIME } from './constants';
import { NetvisorFetcher } from './fetcher';
import { getScheduleFetchDate } from './utils';

import { OfferService } from '$modules/offer/services/offer.service';
import { OfferRequestService } from '$modules/offer-request/offer-request.service';

@Injectable()
export class NetvisorSchedule {
  constructor(
    private readonly netvisorFetcher: NetvisorFetcher,
    private readonly offerService: OfferService,
    private readonly offerRequestService: OfferRequestService,
  ) {}

  @Cron(UPDATE_PAID_STATUS_CRON_TIME)
  async updatePaidStatus(): Promise<void> {
    const startDate = getScheduleFetchDate();

    if (!startDate) {
      return;
    }

    const paidInvoices = await this.netvisorFetcher.fetchPurchaseInvoiceList(
      startDate,
    );

    if (!paidInvoices) {
      return;
    }

    const offers = await this.offerService.getOffersByInvoiceIds(paidInvoices);

    offers.forEach((offer) => {
      const { offerRequestId } = offer.data.initial;

      void this.offerRequestService.updatePaidStatus(
        offerRequestId,
        PaidStatus.PAID,
      );
    });
  }
}
