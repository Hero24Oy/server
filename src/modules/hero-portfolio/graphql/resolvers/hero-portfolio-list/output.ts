import { ObjectType } from '@nestjs/graphql';

import { HeroPortfolioObject } from '../../objects';

import { Paginated } from '$modules/common/dto/pagination.dto';

@ObjectType()
export class HeroPortfolioListOutput extends Paginated(HeroPortfolioObject) {}
