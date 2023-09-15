import { MaybeType } from '../../common/common.types';
import { OfferDto } from '../dto/offer/offer.dto';
import { OffersFilterInput } from '../dto/offers/offers-filter.input';

import { isArray, isBoolean } from '$imports/lodash';

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

  const { chatIds, ids, isApproved, statuses } = filter;

  let offers = rawOffers;

  if (isArray(ids)) {
    offers = offers.filter(({ id }) => ids.includes(id));
  }

  if (isBoolean(isApproved)) {
    offers = offers.filter((offer) => offer.isApproved === isApproved);
  }

  if (isArray(statuses)) {
    offers = offers.filter(({ status }) => statuses.includes(status));
  }

  if (isArray(chatIds)) {
    offers = offers.filter(({ chatId }) =>
      chatId ? chatIds.includes(chatId) : false,
    );
  }

  return offers;
};
