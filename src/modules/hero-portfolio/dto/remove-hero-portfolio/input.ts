import { PickType } from '@nestjs/graphql';

import { HeroPortfolioDto } from '../hero-portfolio';

export class RemoveHeroPortfolioInput extends PickType(HeroPortfolioDto, [
  'id',
  'sellerId',
]) {}
