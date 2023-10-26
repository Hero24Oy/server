import { NestFactory } from '@nestjs/core';

import { AppModule } from '$/app.module';
import { NetvisorService } from '$modules/netvisor/service';
import { OfferService } from '$modules/offer/services/offer.service';

const START_DATE = '2023-01-01';

const markAllPurchasesAsPaid = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  const netvisorService = app.get<NetvisorService>(NetvisorService);
  const offerService = app.get<OfferService>(OfferService);

  await netvisorService.updateOfferRequestPaidStatus(
    offerService.getOffersByInvoiceIdsFromFetch,
    START_DATE,
  );

  process.exit(0);
};

void markAllPurchasesAsPaid();
