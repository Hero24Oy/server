import { NestFactory } from '@nestjs/core';
import { Purchase } from 'hero24-types';

import { AppModule } from '$/app.module';
import { OfferService } from '$modules/offer/services/offer.service';

const updateExtensionIds = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  const offerService = app.get<OfferService>(OfferService);

  const offers = (await offerService.offerTableRef.get()).val();

  if (!offers) {
    return;
  }

  await Promise.all(
    Object.entries(offers).map(async ([id, offer]) => {
      if (!offer.data.extensions) {
        return;
      }

      const extensions = offer.data.extensions.reduce<Purchase[]>(
        (updatedExtensions, extension) => {
          // eslint-disable-next-line no-param-reassign -- we need to set array index
          updatedExtensions[extension.createdAt] = extension;

          return updatedExtensions;
        },
        [],
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
