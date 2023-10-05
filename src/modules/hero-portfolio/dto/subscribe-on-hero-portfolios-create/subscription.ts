import { Field, ObjectType } from '@nestjs/graphql';

import { HeroPortfolioDto } from '../hero-portfolio/dto';

@ObjectType()
export class HeroPortfolioCreatedSubscription {
  @Field(() => HeroPortfolioDto)
  heroPortfolio: HeroPortfolioDto;
}
