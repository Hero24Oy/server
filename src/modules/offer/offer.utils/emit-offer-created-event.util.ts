import { OFFER_CREATED_SUBSCRIPTION } from '../offer.constants';

import { createSubscriptionEventEmitter } from '$modules/graphql-pubsub/graphql-pubsub.utils';

export const emitOfferCreatedEvent = createSubscriptionEventEmitter(
  OFFER_CREATED_SUBSCRIPTION,
);
