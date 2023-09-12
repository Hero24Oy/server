import { AppGraphQlContext } from 'src/app.types';

import { BUYER_PROFILE_UPDATED_SUBSCRIPTION } from '../buyer.constants';
import { BuyerProfileDto } from '../dto/buyer/buyer-profile.dto';

type UserSubscriptionType = typeof BUYER_PROFILE_UPDATED_SUBSCRIPTION;

type Payload = Record<UserSubscriptionType, BuyerProfileDto>;

export const BuyerProfileSubscriptionFilter =
  (type: UserSubscriptionType) =>
  (payload: Payload, _variables: void, { identity }: AppGraphQlContext) => {
    const buyerProfile = payload[type];

    if (buyerProfile.id !== identity?.id) {
      return false;
    }

    return true;
  };
