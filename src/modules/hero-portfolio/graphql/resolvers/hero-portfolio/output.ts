import { ObjectType } from '@nestjs/graphql';

import { HeroPortfolio } from '../../types';

@ObjectType()
export class HeroPortfolioOutput extends HeroPortfolio {}
