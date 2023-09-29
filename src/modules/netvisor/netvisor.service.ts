import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { SCHEDULE_CRON_TIME } from './netvisor.constants';
import { NetvisorFetcher } from './netvisor.fetcher';
import { getTuesdayOrFridayDate } from './netvisor.utils';

import { ConfigType } from '$config';
import { Config } from '$decorator';
import { OfferService } from '$modules/offer/services/offer.service';
import { OfferRequestService } from '$modules/offer-request/offer-request.service';

@Injectable()
export class NetvisorService {
  private readonly fetcher: NetvisorFetcher;

  constructor(
    @Config() config: ConfigType,
    @Inject(OfferService) private readonly offerService: OfferService,
    @Inject(OfferRequestService)
    private readonly offerRequestService: OfferRequestService,
  ) {
    this.fetcher = new NetvisorFetcher(config.netvisor);
  }

  @Cron(SCHEDULE_CRON_TIME)
  async fetchNetvisorPayment(): Promise<void> {
    const startDate = getTuesdayOrFridayDate();

    if (startDate) {
      const paidInvoices = await this.fetcher.getPurchaseInvoiceList(startDate);

      if (paidInvoices) {
        const offers = await this.offerService.getAllOffers();

        const offerByInvoiceId = offers.filter((offer) =>
          paidInvoices.includes(offer.netvisorPurchaseInvoiceId ?? ''),
        );

        offerByInvoiceId.forEach((offer) => {
          const { offerRequestId } = offer.data.initial;

          void this.offerRequestService.updatePaidStatus(
            offerRequestId,
            'paid',
          );
        });
      }
    }
  }
}
