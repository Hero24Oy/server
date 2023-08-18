import { createSubscriptionEventEmitter } from 'src/modules/graphql-pubsub/graphql-pubsub.utils';

import { OFFER_UPDATED_SUBSCRIPTION } from '../offer.constants';

export const emitOfferUpdatedEvent = createSubscriptionEventEmitter(
  OFFER_UPDATED_SUBSCRIPTION,
);
