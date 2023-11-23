import { NestFactory } from '@nestjs/core';
import { Purchase } from 'hero24-types';
import { v4 as uuidv4 } from 'uuid';

import { AppModule } from '$/app.module';
import { OfferService } from '$modules/offer/services/offer.service';

const updateExtensionIds = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  const offerService = app.get<OfferService>(OfferService);

  const offersSnapshot = await offerService.offerTableRef.get();
  const offers = offersSnapshot.val();

  if (!offers) {
    return;
  }

  await Promise.all(
    Object.entries(offers).map(async ([id, offer]) => {
      if (!offer.data.extensions) {
        return;
      }

      const oldExtensions = offer.data.extensions as unknown as Purchase[];

      const extensions = oldExtensions.reduce(
        (updatedExtensions, extension) => {
          return { ...updatedExtensions, [uuidv4()]: extension };
        },
        {} as Record<string, Purchase>,
      );

      await offerService.offerTableRef
        .child(id)
        .child('data')
        .child('extensions')
        .set(extensions);
    }),
  );

  process.exit(0);
};

void updateExtensionIds();
