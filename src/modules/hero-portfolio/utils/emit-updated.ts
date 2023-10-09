import { HERO_PORTFOLIO_UPDATED } from '../constants';

import { createSubscriptionEventEmitter } from '$modules/graphql-pubsub/graphql-pubsub.utils';

export const emitHeroPortfolioUpdated = createSubscriptionEventEmitter(
  HERO_PORTFOLIO_UPDATED,
);
