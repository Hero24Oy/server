import { ObjectType } from '@nestjs/graphql';

import { HeroPortfolioDto } from '../hero-portfolio/hero-portfolio.dto';

import { Paginated } from '$modules/common/dto/pagination.dto';

@ObjectType()
export class HeroPortfolioListDto extends Paginated(HeroPortfolioDto) {}
