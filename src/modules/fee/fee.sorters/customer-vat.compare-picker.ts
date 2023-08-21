import { FeeListComparePicker } from '../fee.types';

export const customerVATComparePicker: FeeListComparePicker<number> = (fee) =>
  fee.customerVAT;
