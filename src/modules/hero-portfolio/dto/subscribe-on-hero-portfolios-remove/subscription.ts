import { Field, ObjectType } from '@nestjs/graphql';

import { HeroPortfolioRemovedDto } from './dto';

@ObjectType()
export class HeroPortfolioRemovedSubscription {
  @Field(() => HeroPortfolioRemovedDto)
  heroPortfolio: HeroPortfolioRemovedDto;
}
