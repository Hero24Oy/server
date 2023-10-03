import { HERO_PORTFOLIO_REMOVED } from '../constants';

import { createSubscriptionEventEmitter } from '$modules/graphql-pubsub/graphql-pubsub.utils';

export const emitHeroPortfolioRemoved = createSubscriptionEventEmitter(
  HERO_PORTFOLIO_REMOVED,
);
