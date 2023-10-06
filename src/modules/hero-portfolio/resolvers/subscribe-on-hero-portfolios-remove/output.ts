import { Field, ObjectType } from '@nestjs/graphql';

import { HeroPortfolioRemovedObject } from './objects';

@ObjectType()
export class HeroPortfolioRemovedOutput {
  @Field(() => HeroPortfolioRemovedObject)
  heroPortfolio: HeroPortfolioRemovedObject;
}
