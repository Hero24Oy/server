import { HERO_PORTFOLIO_CREATED } from '../hero-portfolio.constants';

import { createSubscriptionEventEmitter } from '$modules/graphql-pubsub/graphql-pubsub.utils';

export const emitHeroPortfolioCreated = createSubscriptionEventEmitter(
  HERO_PORTFOLIO_CREATED,
);
