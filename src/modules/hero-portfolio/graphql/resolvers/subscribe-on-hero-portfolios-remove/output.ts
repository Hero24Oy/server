import { Field, ObjectType } from '@nestjs/graphql';

import { HeroPortfolioRemoveObject } from './objects';

@ObjectType()
export class SubscribeOnHeroPortfolioRemoveOutput {
  @Field(() => HeroPortfolioRemoveObject)
  heroPortfolio: HeroPortfolioRemoveObject;
}
