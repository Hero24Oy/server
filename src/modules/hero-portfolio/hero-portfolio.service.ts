import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { HeroPortfolioDB } from 'hero24-types';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseTableReference } from '../firebase/firebase.types';

import { HeroPortfolioDto } from './dto/hero-portfolio/hero-portfolio.dto';
import { HeroPortfolioListArgs } from './dto/hero-portfolio-list/hero-portfolio-list.args';
import { HeroPortfolioListDto } from './dto/hero-portfolio-list/hero-portfolio-list.dto';
import { HeroPortfolioCreatedDto } from './dto/subscriptions/hero-portfolio-created.dto';
import { HeroPortfolioRemovedDto } from './dto/subscriptions/hero-portfolio-removed.dto';
import { emitHeroPortfolioCreated } from './hero-portfolio.utils/emit-hero-portfolio-created';
import { emitHeroPortfolioRemoved } from './hero-portfolio.utils/emit-hero-portfolio-removed';

import { paginate, preparePaginatedResult } from '$modules/common/common.utils';
import { PUBSUB_PROVIDER } from '$modules/graphql-pubsub/graphql-pubsub.constants';

@Injectable()
export class HeroPortfolioService {
  readonly heroPortfolioTableRef: FirebaseTableReference<
    Record<string, HeroPortfolioDB>
  >;

  constructor(
    private readonly firebaseService: FirebaseService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {
    const database = this.firebaseService.getDefaultApp().database();

    this.heroPortfolioTableRef = database.ref(
      FirebaseDatabasePath.HERO_PORTFOLIOS,
    );
  }

  async getPortfolios(
    args: HeroPortfolioListArgs,
  ): Promise<HeroPortfolioListDto> {
    const { sellerId, offset, limit } = args;

    const heroPortfolios =
      (await this.heroPortfolioTableRef.child(sellerId).get()).val() ?? {};

    const heroPortfoliosExternal =
      HeroPortfolioDto.adapter.toExternal(heroPortfolios).data;

    const total = heroPortfoliosExternal.length;

    const nodes = paginate({
      nodes: heroPortfoliosExternal,
      limit,
      offset,
    });

    return preparePaginatedResult({
      nodes,
      total,
      offset,
      limit,
    });
  }

  emitHeroPortfolioCreation(args: HeroPortfolioCreatedDto): void {
    emitHeroPortfolioCreated<HeroPortfolioCreatedDto>(this.pubSub, args);
  }

  emitHeroPortfolioRemoval(args: HeroPortfolioRemovedDto): void {
    emitHeroPortfolioRemoved<HeroPortfolioRemovedDto>(this.pubSub, args);
  }
}
