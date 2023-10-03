import { ObjectType } from '@nestjs/graphql';

import { HeroPortfolioCreatedDto } from './hero-portfolio-created.dto';

@ObjectType()
export class HeroPortfolioRemovedDto extends HeroPortfolioCreatedDto {}
