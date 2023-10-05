import { InputType, OmitType } from '@nestjs/graphql';

import { HeroPortfolioDto } from '../hero-portfolio/dto';

@InputType()
export class CreateHeroPortfolioInput extends OmitType(HeroPortfolioDto, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
