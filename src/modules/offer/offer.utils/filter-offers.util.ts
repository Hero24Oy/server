import isArray from 'lodash/isArray';
import isBoolean from 'lodash/isBoolean';

import { MaybeType } from '../../common/common.types';
import { OfferDto } from '../dto/offer/offer.dto';
import { OffersFilterInput } from '../dto/offers/offers-filter.input';

type FilterOffersProps = {
  offers: OfferDto[];
  filter?: MaybeType<OffersFilterInput>;
};

export const filterOffers = (props: FilterOffersProps) => {
  const { offers: allOffers, filter } = props;

  const rawOffers: OfferDto[] = allOffers;

  if (!filter) {
    return rawOffers;
  }

  const {
    chatIds,
    hubSpotDealIds,
    ids,
    isApproved,
    netvisorOrderIds,
    statuses,
  } = filter;

  let offers = rawOffers;

  if (isBoolean(isApproved)) {
    offers = offers.filter(
      ({ isApproved: offerIsApproved }) =>
        Boolean(offerIsApproved) === isApproved,
    );
  }

  if (isArray(statuses)) {
    offers = offers.filter(({ status }) => statuses.includes(status));
  }

  if (isArray(ids)) {
    offers = offers.filter(({ id }) => ids.includes(id));
  }

  // TODO ? what should we do if value is undefined
  if (isArray(netvisorOrderIds)) {
    offers = offers.filter(({ netvisorOrderId }) =>
      netvisorOrderId ? netvisorOrderIds.includes(netvisorOrderId) : false,
    );
  }

  // TODO ? what should we do if value is undefined
  if (isArray(chatIds)) {
    offers = offers.filter(({ chatId }) =>
      chatId ? chatIds.includes(chatId) : false,
    );
  }

  // TODO ? what should we do if value is undefined
  if (isArray(hubSpotDealIds)) {
    offers = offers.filter(({ hubSpotDealId }) =>
      hubSpotDealId ? hubSpotDealIds.includes(hubSpotDealId) : false,
    );
  }

  return offers;
};
