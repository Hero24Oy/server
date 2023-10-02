import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQlPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';

import { HeroPortfolioResolver } from './hero-portfolio.resolver';
import { HeroPortfolioService } from './hero-portfolio.service';
import { HERO_PORTFOLIO_SORTERS } from './hero-portfolio.sorters';

import { SorterModule } from '$modules/sorter/sorter.module';

@Module({
  imports: [
    FirebaseModule,
    SorterModule.create(HERO_PORTFOLIO_SORTERS),
    GraphQlPubsubModule,
  ],
  providers: [HeroPortfolioResolver, HeroPortfolioService],
  exports: [HeroPortfolioService],
})
export class HeroPortfolioModule {}
