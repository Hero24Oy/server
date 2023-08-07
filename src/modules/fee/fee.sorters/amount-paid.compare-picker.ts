import { FeeListComparePicker } from '../fee.types';

export const amountPaidComparePicker: FeeListComparePicker<number> = (fee) =>
  fee.amountPaid ?? 0;
