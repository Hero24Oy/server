import { Field, ObjectType } from '@nestjs/graphql';

import { HeroPortfolioObject } from '../../objects';

@ObjectType()
export class SubscribeOnHeroPortfoliosCreateOutput {
  @Field(() => HeroPortfolioObject)
  heroPortfolio: HeroPortfolioObject;
}
