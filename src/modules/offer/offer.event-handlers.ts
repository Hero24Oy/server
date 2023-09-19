import { PubSub } from 'graphql-subscriptions';

import { createSubscriptionEventEmitter } from '../graphql-pubsub/graphql-pubsub.utils';

import { OFFER_UPDATED_SUBSCRIPTION } from './offer.constants';
import { createOfferEventHandler } from './offer.utils/create-offer-event-handler.util';

export const updateOfferEventHandler = (pubsub: PubSub) =>
  createOfferEventHandler((offer) => {
    createSubscriptionEventEmitter(OFFER_UPDATED_SUBSCRIPTION)(pubsub, offer);
  });
