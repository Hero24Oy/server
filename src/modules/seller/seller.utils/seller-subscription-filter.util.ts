import { SELLER_PROFILE_UPDATED_SUBSCRIPTION } from '../seller.constants';
import { SellerProfileFilterInput } from '../dto/seller/seller-profile-filter.input';
import { SellerProfileDto } from '../dto/seller/seller-profile.dto';

type UserSubscriptionType = typeof SELLER_PROFILE_UPDATED_SUBSCRIPTION;

type Payload = Record<UserSubscriptionType, SellerProfileDto>;

export const SellerProfileSubscriptionFilter =
  (type: UserSubscriptionType) =>
  (payload: Payload, { filter }: { filter: SellerProfileFilterInput }) => {
    const sellerProfile = payload[type];

    if (!filter.ids?.includes(sellerProfile.id)) {
      return false;
    }

    return true;
  };
