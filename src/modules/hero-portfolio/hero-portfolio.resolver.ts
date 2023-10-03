import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { AuthGuard } from '../auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';

import { HeroPortfolioDto } from './dto/hero-portfolio/hero-portfolio.dto';
import { HeroPortfolioListDto } from './dto/hero-portfolio-list/hero-portfolio-list.dto';
import { HeroPortfolioListInput } from './dto/hero-portfolio-list/hero-portfolio-list.input';
import {
  HERO_PORTFOLIO_CREATED,
  HERO_PORTFOLIO_REMOVED,
} from './hero-portfolio.constants';
import { HeroPortfolioService } from './hero-portfolio.service';
import { HeroPortfolioSubscriptionFilter } from './hero-portfolio.utils/hero-portfolio-subscription-filter';

import { AuthIdentity } from '$modules/auth/auth.decorator';
import { Identity } from '$modules/auth/auth.types';
import { PUBSUB_PROVIDER } from '$modules/graphql-pubsub/graphql-pubsub.constants';

@Resolver()
export class HeroPortfolioResolver {
  constructor(
    private readonly heroPortfolioService: HeroPortfolioService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  @Query(() => HeroPortfolioListDto, { nullable: true })
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async heroPortfolios(
    @Args('input') args: HeroPortfolioListInput,
    @AuthIdentity() identity: Identity,
  ): Promise<HeroPortfolioListDto> {
    return this.heroPortfolioService.getPortfolios(args, identity);
  }

  @Subscription(() => HeroPortfolioDto, {
    name: HERO_PORTFOLIO_CREATED,
    filter: HeroPortfolioSubscriptionFilter(HERO_PORTFOLIO_CREATED),
  })
  @UseGuards(AuthGuard)
  subscribeOnHeroPortFoliosCreate(@Args('sellerId') _sellerId: string) {
    return this.pubSub.asyncIterator(HERO_PORTFOLIO_CREATED);
  }

  @Subscription(() => HeroPortfolioDto, {
    name: HERO_PORTFOLIO_REMOVED,
    filter: HeroPortfolioSubscriptionFilter(HERO_PORTFOLIO_REMOVED),
  })
  @UseGuards(AuthGuard)
  subscribeOnHeroPortFoliosRemove(@Args('sellerId') _sellerId: string) {
    return this.pubSub.asyncIterator(HERO_PORTFOLIO_REMOVED);
  }
}
