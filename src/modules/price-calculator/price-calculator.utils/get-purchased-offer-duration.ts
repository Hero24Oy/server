import { Purchase } from 'hero24-types';
import get from 'lodash/get';
import moment from 'moment-timezone';

import { OfferDto } from '$modules/offer/dto/offer/offer.dto';
import { PurchaseDto } from '$modules/offer/dto/offer/purchase.dto';

export const getPurchasedOfferDuration = (offer: OfferDto): moment.Duration => {
  const purchasedDuration = get(offer, [
    'data',
    'initial',
    'purchase',
    'duration',
  ]);

  const extensions: PurchaseDto[] | Purchase[] =
    get(offer, ['data', 'extensions'], <Purchase[]>[]) || [];

  const extendedDuration = extensions.reduce(
    (total, extension) => total + extension.duration,
    0,
  );

  return moment.duration(purchasedDuration + extendedDuration, 'h');
};
