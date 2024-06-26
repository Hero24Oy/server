import { createSubscriptionEventEmitter } from 'src/modules/graphql-pubsub/graphql-pubsub.utils';

import { BUYER_PROFILE_UPDATED_SUBSCRIPTION } from './buyer.constants';
import { createBuyerProfileEventHandler } from './buyer.utils/create-buyer-profile-event-handler.util';

export const createBuyerProfileUpdatedEventHandler =
  createBuyerProfileEventHandler(
    createSubscriptionEventEmitter(BUYER_PROFILE_UPDATED_SUBSCRIPTION),
  );
