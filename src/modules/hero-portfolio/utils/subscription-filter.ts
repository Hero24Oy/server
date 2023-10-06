import { HERO_PORTFOLIO_CREATED, HERO_PORTFOLIO_REMOVED } from '../constants';
import {
  SubscribeOnHeroPortfolioRemoveOutput,
  SubscribeOnHeroPortfoliosCreateOutput,
} from '../graphql';

type HeroPortfolioSubscriptionType =
  | typeof HERO_PORTFOLIO_CREATED
  | typeof HERO_PORTFOLIO_REMOVED;

interface Payload {
  [HERO_PORTFOLIO_CREATED]: SubscribeOnHeroPortfoliosCreateOutput;
  [HERO_PORTFOLIO_REMOVED]: SubscribeOnHeroPortfolioRemoveOutput;
}

export const HeroPortfolioSubscriptionFilter =
  (type: HeroPortfolioSubscriptionType) =>
  (payload: Payload, { sellerId }: { sellerId: string }): boolean => {
    const { sellerId: payloadSellerId } = payload[type];

    return sellerId === payloadSellerId;
  };
