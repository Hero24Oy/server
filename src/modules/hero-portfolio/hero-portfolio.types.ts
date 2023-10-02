import { Identity } from '../auth/auth.types';
import { ComparePicker, SortablePrimitives } from '../sorter/sorter.types';

import { HeroPortfolioDataDto } from './dto/hero-portfolio/hero-portfolio-data.dto';

export type HeroPortfolioListSorterContext = {
  identity: Identity;
};

export type HeroPortfolioListComparePicker<
  Primitive extends SortablePrimitives = SortablePrimitives,
> = ComparePicker<
  HeroPortfolioDataDto,
  HeroPortfolioListSorterContext,
  Primitive
>;
