import { Injectable } from '@nestjs/common';
import { PaidStatus } from 'hero24-types';

import { CustomScheduleService } from '../custom-schedule/service';

import { NETVISOR_FETCH_JOB } from './constants';
import { NetvisorFetcher } from './fetcher';
import { getScheduleFetchDate } from './utils';

import { ConfigType } from '$config';
import { Config } from '$decorator';
import { OfferService } from '$modules/offer/services/offer.service';
import { OfferRequestService } from '$modules/offer-request/offer-request.service';

@Injectable()
export class NetvisorSchedule {
  constructor(
    private readonly netvisorFetcher: NetvisorFetcher,
    private readonly offerService: OfferService,
    private readonly offerRequestService: OfferRequestService,
    private readonly customScheduleService: CustomScheduleService,
    @Config() config: ConfigType,
  ) {
    customScheduleService.createCronJob(
      NETVISOR_FETCH_JOB,
      config.netvisor.cron,
      this.updatePaidStatus.bind(this),
    );

    void this.updatePaidStatus();
  }

  async updatePaidStatus(): Promise<void> {
    const startDate = getScheduleFetchDate(
      this.customScheduleService.getLastJobDate(NETVISOR_FETCH_JOB),
    );

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
