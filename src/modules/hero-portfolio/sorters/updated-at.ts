import { HeroPortfolioListComparePicker } from '../types';

export const updatedAtComparePicker: HeroPortfolioListComparePicker<number> = (
  item,
) => Number(item.updatedAt);
