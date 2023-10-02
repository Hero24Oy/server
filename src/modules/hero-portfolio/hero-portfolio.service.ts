import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { HeroPortfolioDB } from 'hero24-types';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseTableReference } from '../firebase/firebase.types';

import { HeroPortfolioDto } from './dto/hero-portfolio/hero-portfolio.dto';
import { HeroPortfolioDataDto } from './dto/hero-portfolio/hero-portfolio-data.dto';
import { HeroPortfolioListArgs } from './dto/hero-portfolio-list/hero-portfolio-list.args';
import { HeroPortfolioListDto } from './dto/hero-portfolio-list/hero-portfolio-list.dto';
import { HeroPortfolioOrderColumn } from './dto/hero-portfolio-list/hero-portfolio-list-order-column.enum';
import { HeroPortfolioCreatedDto } from './dto/subscriptions/hero-portfolio-created.dto';
import { HeroPortfolioRemovedDto } from './dto/subscriptions/hero-portfolio-removed.dto';
import { defaultSorting } from './hero-portfolio.constants';
import { HeroPortfolioListSorterContext } from './hero-portfolio.types';
import { emitHeroPortfolioCreated } from './hero-portfolio.utils/emit-hero-portfolio-created';
import { emitHeroPortfolioRemoved } from './hero-portfolio.utils/emit-hero-portfolio-removed';

import { Identity } from '$modules/auth/auth.types';
import { paginate, preparePaginatedResult } from '$modules/common/common.utils';
import { PUBSUB_PROVIDER } from '$modules/graphql-pubsub/graphql-pubsub.constants';
import { SorterService } from '$modules/sorter/sorter.service';

@Injectable()
export class HeroPortfolioService {
  readonly heroPortfolioTableRef: FirebaseTableReference<
    Record<string, HeroPortfolioDB>
  >;

  constructor(
    private readonly firebaseService: FirebaseService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
    private readonly heroPortfolioSorter: SorterService<
      HeroPortfolioOrderColumn,
      HeroPortfolioDataDto,
      HeroPortfolioListSorterContext
    >,
  ) {
    const database = this.firebaseService.getDefaultApp().database();

    this.heroPortfolioTableRef = database.ref(
      FirebaseDatabasePath.HERO_PORTFOLIOS,
    );
  }

  async getPortfolios(
    args: HeroPortfolioListArgs,
    identity: Identity,
  ): Promise<HeroPortfolioListDto> {
    const { sellerId, offset, limit, ordersBy } = args;

    const heroPortfolios =
      (await this.heroPortfolioTableRef.child(sellerId).get()).val() ?? {};

    const heroPortfoliosExternal =
      HeroPortfolioDto.adapter.toExternal(heroPortfolios).data;

    const sortedHeroPortfoliosExternal = this.heroPortfolioSorter.sort(
      heroPortfoliosExternal,
      ordersBy ?? [defaultSorting],
      { identity },
    );

    const total = heroPortfoliosExternal.length;

    const nodes = paginate({
      nodes: sortedHeroPortfoliosExternal,
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
