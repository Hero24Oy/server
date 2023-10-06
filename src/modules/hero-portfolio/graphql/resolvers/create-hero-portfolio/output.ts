import { ObjectType } from '@nestjs/graphql';

import { HeroPortfolio } from '../../types';

@ObjectType()
export class CreateHeroPortfolioOutput extends HeroPortfolio {}
