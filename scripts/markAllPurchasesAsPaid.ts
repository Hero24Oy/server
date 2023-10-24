import { NestFactory } from '@nestjs/core';

import { AppModule } from '$/app.module';
import { NetvisorSchedule } from '$modules/netvisor';
import { OfferService } from '$modules/offer/services/offer.service';

const START_DATE = '2023-01-01';

const markAllPurchasesAsPaid = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  const netvisorSchedule = app.get<NetvisorSchedule>(NetvisorSchedule);
  const offerService = app.get<OfferService>(OfferService);

  await netvisorSchedule.updatePaidStatus(
    offerService.getOffersByInvoiceIdsFromFetch,
    START_DATE,
  );

  process.exit(0);
};

void markAllPurchasesAsPaid();
