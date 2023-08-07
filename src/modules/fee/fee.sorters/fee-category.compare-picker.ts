import { FeeCategory } from '../dto/fee/fee-category.enum';
import { FeeListComparePicker } from '../fee.types';

export const feeCategoryComparePicker: FeeListComparePicker<FeeCategory> = (
  fee,
) => fee.feeCategory;
