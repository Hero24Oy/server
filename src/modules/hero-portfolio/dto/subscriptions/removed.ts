import { Field, ObjectType, PickType } from '@nestjs/graphql';

import { HeroPortfolioDto } from '../hero-portfolio';

@ObjectType()
export class HeroPortfolioRemovedDto {
  @Field(() => PickType(HeroPortfolioDto, ['id', 'sellerId']))
  heroPortfolio: Pick<HeroPortfolioDto, 'id' | 'sellerId'>;
}
