import { Injectable } from '@nestjs/common';

import { CustomScheduleService } from '../custom-schedule/service';

import { NETVISOR_FETCH_JOB } from './constants';
import { NetvisorService } from './service';

import { ConfigType } from '$config';
import { Config } from '$decorator';
import { OfferService } from '$modules/offer/services/offer.service';

@Injectable()
export class NetvisorSchedule {
  constructor(
    private readonly netvisorService: NetvisorService,
    private readonly offerService: OfferService,
    customScheduleService: CustomScheduleService,
    @Config() config: ConfigType,
  ) {
    customScheduleService.createCronJob(
      NETVISOR_FETCH_JOB,
      config.netvisor.cron,
      () => {
        this.updatePaidStatus((ids) =>
          this.offerService.getOffersByInvoiceIdsFromMirror(ids),
        );
      },
    );
  }

  updatePaidStatus(
    ...args: Parameters<NetvisorService['updateOfferRequestPaidStatus']>
  ): void {
    void this.netvisorService.updateOfferRequestPaidStatus(...args);
  }
}
