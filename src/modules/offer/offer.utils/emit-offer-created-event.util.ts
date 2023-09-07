import { createSubscriptionEventEmitter } from 'src/modules/graphql-pubsub/graphql-pubsub.utils';

import { OFFER_CREATED_SUBSCRIPTION } from '../offer.constants';

export const emitOfferCreatedEvent = createSubscriptionEventEmitter(
  OFFER_CREATED_SUBSCRIPTION,
);
