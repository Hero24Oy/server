import { ObjectType } from '@nestjs/graphql';

import { HeroPortfolio } from '../../types';

import { Paginated } from '$modules/common/dto/pagination.dto';

@ObjectType()
export class HeroPortfolioListOutput extends Paginated(HeroPortfolio) {}
