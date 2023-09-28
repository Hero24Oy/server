import { ObjectType } from '@nestjs/graphql';

import { HeroPortfolioDataDto } from '../hero-portfolio/hero-portfolio-data.dto';

import { Paginated } from '$modules/common/dto/pagination.dto';

@ObjectType()
export class HeroPortfolioListDto extends Paginated(HeroPortfolioDataDto) {}
