import { Injectable, Logger } from '@nestjs/common';
import { PaidStatus } from 'hero24-types';

import { CustomScheduleService } from '../custom-schedule/service';

import { NETVISOR_FETCH_JOB } from './constants';
import { NetvisorFetcher } from './fetcher';
import { getPreviousDay } from './utils';

import { ConfigType } from '$config';
import { Config } from '$decorator';
import { OfferDto } from '$modules/offer/dto/offer/offer.dto';
import { OfferService } from '$modules/offer/services/offer.service';
import { OfferRequestService } from '$modules/offer-request/offer-request.service';

@Injectable()
export class NetvisorSchedule {
  private readonly logger = new Logger(NetvisorSchedule.name);

  constructor(
    private readonly netvisorFetcher: NetvisorFetcher,
    private readonly offerService: OfferService,
    private readonly offerRequestService: OfferRequestService,
    customScheduleService: CustomScheduleService,
    @Config() config: ConfigType,
  ) {
    customScheduleService.createCronJob(
      NETVISOR_FETCH_JOB,
      config.netvisor.cron,
      this.updatePaidStatus.bind(
        this,
        this.offerService.getOffersByInvoiceIdsFromMirror.bind(
          this.offerService,
        ),
      ),
    );
  }

  async updatePaidStatus(
    method: (paidInvoices: string[]) => Promise<OfferDto[]>,
    fromDate?: string,
  ): Promise<void> {
    try {
      const startDate = fromDate ?? getPreviousDay();

      const paidInvoices = await this.netvisorFetcher.fetchPurchaseInvoiceList(
        startDate,
      );

      if (!paidInvoices) {
        return;
      }

      const offers = await method(paidInvoices);

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
