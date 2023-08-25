import { createSubscriptionEventEmitter } from '../graphql-pubsub/graphql-pubsub.utils';
import { OFFER_REQUEST_UPDATED_SUBSCRIPTION } from './offer-request.constants';

export const emitOfferRequestUpdated = createSubscriptionEventEmitter(
  OFFER_REQUEST_UPDATED_SUBSCRIPTION,
);
