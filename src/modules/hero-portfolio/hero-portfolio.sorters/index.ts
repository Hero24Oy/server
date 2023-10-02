import { HeroPortfolioOrderColumn } from '../dto/hero-portfolio-list/hero-portfolio-list-order-column.enum';
import { HeroPortfolioListComparePicker } from '../hero-portfolio.types';

import { categoryIdComparePicker } from './category-id.compare-picker';
import { createdAtComparePicker } from './created-at.compare-picker';
import { descriptionComparePicker } from './description.compare-picker';
import { idComparePicker } from './id.compare-picker';
import { updatedAtComparePicker } from './updated-at.compare-picker';

export const HERO_PORTFOLIO_SORTERS: Record<
  HeroPortfolioOrderColumn,
  HeroPortfolioListComparePicker
> = {
  [HeroPortfolioOrderColumn.ID]: idComparePicker,
  [HeroPortfolioOrderColumn.CATEGORY_ID]: categoryIdComparePicker,
  [HeroPortfolioOrderColumn.DESCRIPTION]: descriptionComparePicker,
  [HeroPortfolioOrderColumn.CREATED_AT]: createdAtComparePicker,
  [HeroPortfolioOrderColumn.UPDATED_AT]: updatedAtComparePicker,
};
