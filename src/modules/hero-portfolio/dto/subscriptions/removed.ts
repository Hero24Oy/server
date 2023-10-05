import { ObjectType } from '@nestjs/graphql';

import { HeroPortfolioCreatedDto } from './created';

@ObjectType()
export class HeroPortfolioRemovedDto extends HeroPortfolioCreatedDto {}
