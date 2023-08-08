import { FeeListComparePicker } from '../fee.types';

export const createdAtComparePicker: FeeListComparePicker<number> = (fee) =>
  Number(fee.createdAt);
