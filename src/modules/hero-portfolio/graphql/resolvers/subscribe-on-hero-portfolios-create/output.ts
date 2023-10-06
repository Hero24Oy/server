import { ObjectType } from '@nestjs/graphql';

import { HeroPortfolio } from '../../types';

@ObjectType()
export class SubscribeOnHeroPortfoliosCreateOutput extends HeroPortfolio {}
