import { InputType, OmitType } from '@nestjs/graphql';

import { HeroPortfolioDto } from './dto';

@InputType()
export class HeroPortfolioInput extends OmitType(HeroPortfolioDto, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
