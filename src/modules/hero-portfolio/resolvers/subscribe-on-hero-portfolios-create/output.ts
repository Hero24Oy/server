import { Field, ObjectType } from '@nestjs/graphql';

import { HeroPortfolioOutput } from '../hero-portfolio';

@ObjectType()
export class HeroPortfolioCreatedOutput {
  @Field(() => HeroPortfolioOutput)
  heroPortfolio: HeroPortfolioOutput;
}
