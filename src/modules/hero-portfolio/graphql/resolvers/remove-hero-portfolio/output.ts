import { Field, ObjectType } from '@nestjs/graphql';

import { HeroPortfolioObject } from '../../objects';

@ObjectType()
export class RemoveHeroPortfolioOutput {
  @Field(() => HeroPortfolioObject)
  heroPortfolio: HeroPortfolioObject;
}
