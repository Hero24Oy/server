import {
  HERO_PORTFOLIO_CREATED,
  HERO_PORTFOLIO_REMOVED,
  HERO_PORTFOLIO_UPDATED,
} from '../constants';
import {
  SubscribeOnHeroPortfolioRemoveOutput,
  SubscribeOnHeroPortfoliosCreateOutput,
  SubscribeOnHeroPortfolioUpdateOutput,
} from '../graphql';

type HeroPortfolioSubscriptionType =
  | typeof HERO_PORTFOLIO_CREATED
  | typeof HERO_PORTFOLIO_REMOVED
  | typeof HERO_PORTFOLIO_UPDATED;

interface Payload {
  [HERO_PORTFOLIO_CREATED]: SubscribeOnHeroPortfoliosCreateOutput;
  [HERO_PORTFOLIO_REMOVED]: SubscribeOnHeroPortfolioRemoveOutput;
  [HERO_PORTFOLIO_UPDATED]: SubscribeOnHeroPortfolioUpdateOutput;
}

export const HeroPortfolioSubscriptionFilter =
  (type: HeroPortfolioSubscriptionType) =>
  (payload: Payload, { sellerId }: { sellerId: string }): boolean => {
    const { heroPortfolio } = payload[type];

    return sellerId === heroPortfolio.sellerId;
  };
