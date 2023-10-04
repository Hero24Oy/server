import { HeroPortfolioOrderColumn } from './dto/hero-portfolio-list/order-column';

import { SortOrder } from '$modules/common/sort-order/sort-order.enum';

export const HERO_PORTFOLIO_CREATED = 'heroPortfolioCreated';
export const HERO_PORTFOLIO_REMOVED = 'heroPortfolioRemoved';

export const defaultSorting = [
  {
    column: HeroPortfolioOrderColumn.CREATED_AT,
    order: SortOrder.DESC,
  },
];

export const ID_FRAGMENTS_AMOUNT = 8;
