import { HERO_PORTFOLIO_CREATED, HERO_PORTFOLIO_REMOVED } from '../constants';
import {
  HeroPortfolioCreatedOutput,
  HeroPortfolioRemovedOutput,
} from '../resolvers';

type HeroPortfolioSubscriptionType =
  | typeof HERO_PORTFOLIO_CREATED
  | typeof HERO_PORTFOLIO_REMOVED;

interface Payload {
  [HERO_PORTFOLIO_CREATED]: HeroPortfolioCreatedOutput;
  [HERO_PORTFOLIO_REMOVED]: HeroPortfolioRemovedOutput;
}

export const HeroPortfolioSubscriptionFilter =
  (type: HeroPortfolioSubscriptionType) =>
  (payload: Payload, { sellerId }: { sellerId: string }): boolean => {
    const { sellerId: payloadSellerId } = payload[type];

    return sellerId === payloadSellerId;
  };
