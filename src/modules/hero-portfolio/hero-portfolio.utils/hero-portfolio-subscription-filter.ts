import { HeroPortfolioCreatedDto } from '../dto/subscriptions/hero-portfolio-created.dto';
import { HeroPortfolioRemovedDto } from '../dto/subscriptions/hero-portfolio-removed.dto';
import {
  HERO_PORTFOLIO_CREATED,
  HERO_PORTFOLIO_REMOVED,
} from '../hero-portfolio.constants';

type HeroPortfolioSubscriptionType =
  | typeof HERO_PORTFOLIO_CREATED
  | typeof HERO_PORTFOLIO_REMOVED;

interface Payload {
  [HERO_PORTFOLIO_CREATED]: HeroPortfolioCreatedDto;
  [HERO_PORTFOLIO_REMOVED]: HeroPortfolioRemovedDto;
}

export const HeroPortfolioSubscriptionFilter =
  (type: HeroPortfolioSubscriptionType) =>
  (payload: Payload, { sellerId }: { sellerId: string }): boolean => {
    const { heroPortfolio } = payload[type];

    return sellerId === heroPortfolio.sellerId;
  };
