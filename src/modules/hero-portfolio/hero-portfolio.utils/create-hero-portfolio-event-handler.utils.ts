import { PubSub } from 'graphql-subscriptions';
import { HeroPortfolioDB } from 'hero24-types';

import { HeroPortfolioDto } from '../dto/hero-portfolio/hero-portfolio.dto';
import { HeroPortfolioDataDto } from '../dto/hero-portfolio/hero-portfolio-data.dto';

import { FirebaseSnapshot } from '$modules/firebase/firebase.types';

export const createHeroPortfolioEventHandler =
  (
    eventEmitter: (
      pubsub: PubSub,
      heroPortfolio: Record<'data', HeroPortfolioDataDto[]>,
    ) => void,
  ) =>
  (pubsub: PubSub) =>
  (snapshot: FirebaseSnapshot<HeroPortfolioDB>): void => {
    const heroPortfolio = snapshot.val();

    if (!snapshot.key || !heroPortfolio) {
      return;
    }

    eventEmitter(
      pubsub,
      HeroPortfolioDto.adapter.toExternal({ [snapshot.key]: heroPortfolio }),
    );
  };
