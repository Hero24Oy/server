import { ObjectType } from '@nestjs/graphql';

import { HeroPortfolioObject } from '../../objects';

@ObjectType()
export class CreateHeroPortfolioOutput extends HeroPortfolioObject {}
