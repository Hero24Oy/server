import { HeroPortfolioListComparePicker } from '../hero-portfolio.types';

export const createdAtComparePicker: HeroPortfolioListComparePicker<number> = (
  item,
) => Number(item.createdAt);
