import { Field, ObjectType } from '@nestjs/graphql';

import { HeroPortfolioDataDto } from '../hero-portfolio/hero-portfolio-data.dto';

@ObjectType()
export class HeroPortfolioCreatedDto {
  @Field(() => String)
  sellerId: string;

  @Field(() => HeroPortfolioDataDto)
  data: HeroPortfolioDataDto;
}
