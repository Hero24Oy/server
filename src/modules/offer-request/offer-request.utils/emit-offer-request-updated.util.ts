import { OFFER_REQUEST_UPDATED_SUBSCRIPTION } from '../offer-request.constants';

import { createSubscriptionEventEmitter } from '$modules/graphql-pubsub/graphql-pubsub.utils';

export const emitOfferRequestUpdated = createSubscriptionEventEmitter(
  OFFER_REQUEST_UPDATED_SUBSCRIPTION,
);
