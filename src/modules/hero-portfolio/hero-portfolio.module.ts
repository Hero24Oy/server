import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQlPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';

import { HeroPortfolioResolver } from './hero-portfolio.resolver';
import { HeroPortfolioService } from './hero-portfolio.service';

@Module({
  imports: [FirebaseModule, GraphQlPubsubModule],
  providers: [HeroPortfolioResolver, HeroPortfolioService],
  exports: [HeroPortfolioService],
})
export class HeroPortfolioModule {}
