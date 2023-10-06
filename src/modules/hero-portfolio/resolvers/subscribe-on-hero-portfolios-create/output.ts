import { ObjectType } from '@nestjs/graphql';

import { HeroPortfolioOutput } from '../hero-portfolio';

@ObjectType()
export class HeroPortfolioCreatedOutput extends HeroPortfolioOutput {}
