import { OFFER_UPDATED_SUBSCRIPTION } from '../offer.constants';

import { createSubscriptionEventEmitter } from '$modules/graphql-pubsub/graphql-pubsub.utils';

export const emitOfferUpdatedEvent = createSubscriptionEventEmitter(
  OFFER_UPDATED_SUBSCRIPTION,
);
