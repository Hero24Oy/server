import {
  HERO_PORTFOLIO_CREATED,
  HERO_PORTFOLIO_REMOVED,
} from './hero-portfolio.constants';
import { createHeroPortfolioEventHandler } from './hero-portfolio.utils/create-hero-portfolio-event-handler.utils';

import { createSubscriptionEventEmitter } from '$modules/graphql-pubsub/graphql-pubsub.utils';

export const createHeroPortfolioCreatedEventHandler =
  createHeroPortfolioEventHandler(
    createSubscriptionEventEmitter(HERO_PORTFOLIO_CREATED),
  );

export const createHeroPortfolioRemovedEventHandler =
  createHeroPortfolioEventHandler(
    createSubscriptionEventEmitter(HERO_PORTFOLIO_REMOVED),
  );
