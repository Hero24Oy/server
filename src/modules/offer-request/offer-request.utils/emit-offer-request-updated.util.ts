import { OFFER_REQUEST_UPDATED_SUBSCRIPTION } from '../offer-request.constants';

import { createSubscriptionEventEmitter } from '$/src/modules/graphql-pubsub/graphql-pubsub.utils';

export const emitOfferRequestUpdated = createSubscriptionEventEmitter(
  OFFER_REQUEST_UPDATED_SUBSCRIPTION,
);
