import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { PaidStatus } from 'hero24-types';

import { AppModule } from '$/app.module';
import { NetvisorFetcher } from '$modules/netvisor';
import { OfferService } from '$modules/offer/services/offer.service';
import { OfferRequestService } from '$modules/offer-request/offer-request.service';

const START_DATE = '2023-01-01';

const markAllPurchasesAsPaid = async (): Promise<void> => {
  const logger = new Logger('Script');

  const app = await NestFactory.create(AppModule);
  const netvisorFetcher = app.get<NetvisorFetcher>(NetvisorFetcher);
  const offerService = app.get<OfferService>(OfferService);
  const offerRequestService = app.get<OfferRequestService>(OfferRequestService);

  try {
    const paidInvoices = await netvisorFetcher.fetchPurchaseInvoiceList(
      START_DATE,
    );

    if (!paidInvoices) {
      return;
    }

    const offers = await offerService.getOffersByInvoiceIds(paidInvoices);

    const promises = offers.map(async (offer) => {
      try {
        const { offerRequestId } = offer.data.initial;

        await offerRequestService.updatePaidStatus(
          offerRequestId,
          PaidStatus.PAID,
        );
      } catch (error) {
        logger.error(error);
        logger.debug(offer);
      }
    });

    await Promise.all(promises);
  } catch (error) {
    logger.error(error);
  }

  process.exit(0);
};

void markAllPurchasesAsPaid();
