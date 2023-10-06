import { ObjectType } from '@nestjs/graphql';

import { HeroPortfolioOutput } from '../hero-portfolio';

import { Paginated } from '$modules/common/dto/pagination.dto';

@ObjectType()
export class HeroPortfolioListOutput extends Paginated(HeroPortfolioOutput) {}
