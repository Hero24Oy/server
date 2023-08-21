import { FeeListComparePicker } from '../fee.types';

export const platformFeePercentageComparePicker: FeeListComparePicker<
  number
> = (fee) => fee.platformFeePercentage;
