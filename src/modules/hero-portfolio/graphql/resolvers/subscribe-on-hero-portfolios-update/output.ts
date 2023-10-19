import { Field, ObjectType } from '@nestjs/graphql';

import { HeroPortfolioObject } from '../../objects';

@ObjectType()
export class SubscribeOnHeroPortfolioUpdateOutput {
  @Field(() => HeroPortfolioObject)
  heroPortfolio: HeroPortfolioObject;
}
