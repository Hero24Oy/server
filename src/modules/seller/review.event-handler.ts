import { SELLER_PROFILE_UPDATED_SUBSCRIPTION } from './seller.constants';
import { createReviewEventHandler } from './seller.utils/create-seller-profile-event-handler.util';

import { createSubscriptionEventEmitter } from '$/src/modules/graphql-pubsub/graphql-pubsub.utils';

export const createBuyerProfileUpdatedEventHandler = createReviewEventHandler(
  createSubscriptionEventEmitter(SELLER_PROFILE_UPDATED_SUBSCRIPTION),
);
