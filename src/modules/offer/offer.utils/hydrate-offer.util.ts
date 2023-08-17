import { OfferInput } from '../dto/creation/offer.input';
import { OfferDto } from '../dto/offer/offer.dto';

type HydrateOfferParams = {
  id: string;
};

export const hydrateOffer = (
  offer: OfferInput,
  { id }: HydrateOfferParams,
): OfferDto => {
  const timestamp = new Date();

  const offerPopulated: OfferDto = {
    id,
    isApproved: false,
    status: 'open',
    seenByBuyer: false,
    data: {
      isPaused: false,
      seenBySeller: true,
      initial: {
        ...offer.data.initial,
        createdAt: timestamp,
        purchase: {
          ...offer.data.initial.purchase,
          createdAt: timestamp,
        },
      },
    },
  };

  return offerPopulated;
};
