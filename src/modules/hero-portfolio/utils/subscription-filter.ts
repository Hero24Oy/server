import { HERO_PORTFOLIO_CREATED, HERO_PORTFOLIO_REMOVED } from '../constants';
import {
  HeroPortfolioCreatedSubscription,
  HeroPortfolioRemovedSubscription,
} from '../dto';

type HeroPortfolioSubscriptionType =
  | typeof HERO_PORTFOLIO_CREATED
  | typeof HERO_PORTFOLIO_REMOVED;

interface Payload {
  [HERO_PORTFOLIO_CREATED]: HeroPortfolioCreatedSubscription;
  [HERO_PORTFOLIO_REMOVED]: HeroPortfolioRemovedSubscription;
}

export const HeroPortfolioSubscriptionFilter =
  (type: HeroPortfolioSubscriptionType) =>
  (payload: Payload, { sellerId }: { sellerId: string }): boolean => {
    const { heroPortfolio } = payload[type];

    return sellerId === heroPortfolio.sellerId;
  };
