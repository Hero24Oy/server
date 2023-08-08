import { Identity } from '../auth/auth.types';
import { ComparePicker, SortablePrimitives } from '../sorter/sorter.types';

import { FeeDto } from './dto/fee/fee.dto';

export type FeeListSorterContext = {
  identity: Identity;
};

export type FeeListComparePicker<
  Primitive extends SortablePrimitives = SortablePrimitives,
> = ComparePicker<FeeDto, FeeListSorterContext, Primitive>;
