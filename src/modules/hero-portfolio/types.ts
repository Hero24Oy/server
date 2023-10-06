import { HeroPortfolioDataDB } from 'hero24-types';

import { Identity } from '../auth/auth.types';
import { ComparePicker, SortablePrimitives } from '../sorter/sorter.types';

import { HeroPortfolioOutput } from './graphql';

export type HeroPortfolioListSorterContext = {
  identity: Identity;
};

export type HeroPortfolioListComparePicker<
  Primitive extends SortablePrimitives = SortablePrimitives,
> = ComparePicker<
  HeroPortfolioOutput,
  HeroPortfolioListSorterContext,
  Primitive
>;

export interface HeroPortfolioDataWithIds extends HeroPortfolioDataDB {
  id: string;
  sellerId: string;
}

export type GetHeroPortfolioByIdArgs = {
  id: string;
  sellerId: string;
};
