import { OfferDto } from '../dto/offer/offer.dto';
import { OfferRole } from '../dto/offer/offer-role.enum';

import { Scope } from '$modules/auth/auth.constants';
import { Identity } from '$modules/auth/auth.types';

export const hasMatchingRole = (
  offer: OfferDto,
  identity: Identity | null,
  role?: OfferRole,
): boolean => {
  const { buyerProfileId, sellerProfileId } = offer.data.initial;

  switch (role) {
    case OfferRole.CUSTOMER:
      return buyerProfileId === identity?.id;
    case OfferRole.SELLER:
      return sellerProfileId === identity?.id;

    default:
      return Boolean(!offer && identity?.scope === Scope.ADMIN);
  }
};
