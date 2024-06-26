import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(NetvisorSchedule.name);

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

    // Fetch all unpaid purchases
    void this.updatePaidStatus();
  }

  async updatePaidStatus(): Promise<void> {
    try {
      const startDate = getScheduleFetchDate(
        this.customScheduleService.getLastJobDate(NETVISOR_FETCH_JOB),
      );

      const paidInvoices = await this.netvisorFetcher.fetchPurchaseInvoiceList(
        startDate,
      );

      if (!paidInvoices) {
        return;
      }

      const offers = await this.offerService.getOffersByInvoiceIds(
        paidInvoices,
      );

      const promises = offers.map(async (offer) => {
        try {
          const { offerRequestId } = offer.data.initial;

          await this.offerRequestService.updatePaidStatus(
            offerRequestId,
            PaidStatus.PAID,
          );
        } catch (error) {
          this.logger.error(error);
          this.logger.debug(offer);
        }
      });

      await Promise.all(promises);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
