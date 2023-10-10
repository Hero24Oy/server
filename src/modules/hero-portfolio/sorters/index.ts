import { HeroPortfolioOrderColumn } from '../graphql';
import { HeroPortfolioListComparePicker } from '../types';

import { categoryIdComparePicker } from './category-id';
import { createdAtComparePicker } from './created-at';
import { descriptionComparePicker } from './description';
import { idComparePicker } from './id';
import { updatedAtComparePicker } from './updated-at';

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
