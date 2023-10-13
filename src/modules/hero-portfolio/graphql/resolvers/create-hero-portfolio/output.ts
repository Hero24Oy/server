import { Field, ObjectType } from '@nestjs/graphql';

import { HeroPortfolioObject } from '../../objects';

@ObjectType()
export class CreateHeroPortfolioOutput {
  @Field(() => HeroPortfolioObject)
  heroPortfolio: HeroPortfolioObject;
}
