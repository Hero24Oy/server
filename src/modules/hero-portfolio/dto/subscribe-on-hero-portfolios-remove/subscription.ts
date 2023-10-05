import { Field, ObjectType } from '@nestjs/graphql';

import { HeroPortfolioRemoved } from './dto';

@ObjectType()
export class HeroPortfolioRemovedSubscription {
  @Field(() => HeroPortfolioRemoved)
  heroPortfolio: HeroPortfolioRemoved;
}
