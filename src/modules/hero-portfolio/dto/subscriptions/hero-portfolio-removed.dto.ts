import { Field, ObjectType, PickType } from '@nestjs/graphql';

import { HeroPortfolioCreatedDto } from './hero-portfolio-created.dto';

@ObjectType()
export class HeroPortfolioRemovedDto extends PickType(HeroPortfolioCreatedDto, [
  'sellerId',
]) {
  @Field(() => String)
  heroPortfolioId: string;
}
