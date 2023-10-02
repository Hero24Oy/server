import { HeroPortfolioListComparePicker } from '../hero-portfolio.types';

export const categoryIdComparePicker: HeroPortfolioListComparePicker<string> = (
  item,
) => item.categoryId;
