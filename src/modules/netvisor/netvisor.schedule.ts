import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { UPDATE_PAID_STATUS_CRON_TIME } from './netvisor.constants';
import { NetvisorFetcher } from './netvisor.fetcher';
import { getScheduleFetchDate } from './netvisor.utils/get-schedule-fetch-date';

import { OfferService } from '$modules/offer/services/offer.service';
import { OfferRequestService } from '$modules/offer-request/offer-request.service';
import { PaidStatus } from '$modules/offer-request/open-offer-request/dto/offer-request-paid-status.enum';

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
