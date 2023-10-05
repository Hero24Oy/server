import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';

import { HeroPortfolioDto } from '../hero-portfolio';

@InputType()
export class EditHeroPortfolioInput extends PartialType(
  OmitType(HeroPortfolioDto, ['createdAt', 'updatedAt']),
) {
  @Field(() => String)
  id: string;

  @Field(() => String)
  sellerId: string;
}
