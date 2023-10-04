import { HeroPortfolioListComparePicker } from '../types';

export const createdAtComparePicker: HeroPortfolioListComparePicker<number> = (
  item,
) => Number(item.createdAt);
