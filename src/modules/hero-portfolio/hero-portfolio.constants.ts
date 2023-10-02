import { HeroPortfolioOrderColumn } from './dto/hero-portfolio-list/hero-portfolio-list-order-column.enum';

import { SortOrder } from '$modules/common/sort-order/sort-order.enum';

export const HERO_PORTFOLIO_CREATED = 'heroPortfolioCreated';
export const HERO_PORTFOLIO_REMOVED = 'heroPortfolioRemoved';

export const defaultSorting = {
  column: HeroPortfolioOrderColumn.CREATED_AT,
  order: SortOrder.DESC,
};
