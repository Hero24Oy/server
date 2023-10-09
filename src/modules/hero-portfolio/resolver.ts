import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { AuthGuard } from '../auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';

import { HERO_PORTFOLIO_CREATED, HERO_PORTFOLIO_REMOVED } from './constants';
import {
  CreateHeroPortfolioInput,
  CreateHeroPortfolioOutput,
  EditHeroPortfolioInput,
  EditHeroPortfolioOutput,
  HeroPortfolioListInput,
  HeroPortfolioListOutput,
  RemoveHeroPortfolioInput,
  RemoveHeroPortfolioOutput,
  SubscribeOnHeroPortfolioRemoveOutput,
  SubscribeOnHeroPortfoliosCreateOutput,
} from './graphql';
import { HeroPortfolioService } from './service';
import { HeroPortfolioSubscriptionFilter } from './utils';

import { AuthIdentity } from '$modules/auth/auth.decorator';
import { Identity } from '$modules/auth/auth.types';
import { PUBSUB_PROVIDER } from '$modules/graphql-pubsub/graphql-pubsub.constants';

@Resolver()
export class HeroPortfolioResolver {
  constructor(
    private readonly heroPortfolioService: HeroPortfolioService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  @Query(() => HeroPortfolioListOutput, { nullable: true })
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async heroPortfolios(
    @Args('input') args: HeroPortfolioListInput,
    @AuthIdentity() identity: Identity,
  ): Promise<HeroPortfolioListOutput> {
    return this.heroPortfolioService.getPortfolios(args, identity);
  }

  @Mutation(() => CreateHeroPortfolioOutput)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async createHeroPortfolio(
    @Args('input') input: CreateHeroPortfolioInput,
    @AuthIdentity() identity: Identity,
  ): Promise<CreateHeroPortfolioOutput> {
    const heroPortfolio = await this.heroPortfolioService.createHeroPortfolio(
      input,
      identity,
    );

    this.heroPortfolioService.emitHeroPortfolioCreation(heroPortfolio);

    return heroPortfolio;
  }

  @Mutation(() => EditHeroPortfolioOutput)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async editHeroPortfolio(
    @Args('input') input: EditHeroPortfolioInput,
    @AuthIdentity() identity: Identity,
  ): Promise<EditHeroPortfolioOutput> {
    return this.heroPortfolioService.editHeroPortfolio(input, identity);
  }

  @Mutation(() => RemoveHeroPortfolioOutput)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async removeHeroPortfolio(
    @Args('input') input: RemoveHeroPortfolioInput,
    @AuthIdentity() identity: Identity,
  ): Promise<RemoveHeroPortfolioOutput> {
    const heroPortfolio = await this.heroPortfolioService.removeHeroPortfolio(
      input,
      identity,
    );

    this.heroPortfolioService.emitHeroPortfolioRemoval(heroPortfolio);

    return heroPortfolio;
  }

  @Subscription(() => SubscribeOnHeroPortfoliosCreateOutput, {
    name: HERO_PORTFOLIO_CREATED,
    filter: HeroPortfolioSubscriptionFilter(HERO_PORTFOLIO_CREATED),
  })
  @UseGuards(AuthGuard)
  subscribeOnHeroPortfoliosCreate(@Args('sellerId') _sellerId: string) {
    return this.pubSub.asyncIterator(HERO_PORTFOLIO_CREATED);
  }

  @Subscription(() => SubscribeOnHeroPortfolioRemoveOutput, {
    name: HERO_PORTFOLIO_REMOVED,
    filter: HeroPortfolioSubscriptionFilter(HERO_PORTFOLIO_REMOVED),
  })
  @UseGuards(AuthGuard)
  subscribeOnHeroPortfoliosRemove(@Args('sellerId') _sellerId: string) {
    return this.pubSub.asyncIterator(HERO_PORTFOLIO_REMOVED);
  }
}
