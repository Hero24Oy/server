import { AppGraphQLContext } from 'src/app.types';
import { BuyerProfileDto } from '../dto/buyer/buyer-profile.dto';
import { BUYER_PROFILE_UPDATED_SUBSCRIPTION } from '../buyer.constants';

type UserSubscriptionType = typeof BUYER_PROFILE_UPDATED_SUBSCRIPTION;

type Payload = Record<UserSubscriptionType, BuyerProfileDto>;

export const BuyerProfileSubscriptionFilter =
  (type: UserSubscriptionType) =>
  (payload: Payload, _variables: void, { identity }: AppGraphQLContext) => {
    const buyerProfile = payload[type];

    if (buyerProfile.id !== identity?.id) {
      return false;
    }

    return true;
  };
