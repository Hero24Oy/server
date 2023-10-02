import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { UPDATE_PAID_STATUS_CRON_TIME } from './netvisor.constants';
import { NetvisorFetcher } from './netvisor.fetcher';
import { getScheduleFetchDate } from './netvisor.utils/getScheduleFetchDate';

import { ConfigType } from '$config';
import { Config } from '$decorator';
import { CryptoService } from '$modules/crypto/crypto.service';
import { OfferService } from '$modules/offer/services/offer.service';
import { OfferRequestService } from '$modules/offer-request/offer-request.service';

@Injectable()
export class NetvisorSchedule {
  private readonly fetcher: NetvisorFetcher;

  constructor(
    @Config() config: ConfigType,
    private readonly offerService: OfferService,
    private readonly offerRequestService: OfferRequestService,
    private readonly cryptoService: CryptoService,
  ) {
    this.fetcher = new NetvisorFetcher(config.netvisor, this.cryptoService);
  }

  @Cron(UPDATE_PAID_STATUS_CRON_TIME)
  async updatePaidStatus(): Promise<void> {
    const startDate = getScheduleFetchDate();

    if (!startDate) {
      return;
    }

    const paidInvoices = await this.fetcher.fetchPurchaseInvoiceList(startDate);

    if (!paidInvoices) {
      return;
    }

    const offers = await this.offerService.getOffersByInvoiceIds(paidInvoices);

    offers.forEach((offer) => {
      const { offerRequestId } = offer.data.initial;

      void this.offerRequestService.updatePaidStatus(offerRequestId, 'paid');
    });
  }
}
