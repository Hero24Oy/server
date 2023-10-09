import { Field, ObjectType } from '@nestjs/graphql';

import { HeroPortfolioObject } from '../../objects';

@ObjectType()
export class EditHeroPortfolioOutput {
  @Field(() => HeroPortfolioObject)
  heroPortfolio: HeroPortfolioObject;
}
