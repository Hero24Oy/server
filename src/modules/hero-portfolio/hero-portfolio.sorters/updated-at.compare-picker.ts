import { HeroPortfolioListComparePicker } from '../hero-portfolio.types';

export const updatedAtComparePicker: HeroPortfolioListComparePicker<number> = (
  item,
) => Number(item.updatedAt);
