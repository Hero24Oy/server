import { FeeListComparePicker } from '../fee.types';

export const userIdComparePicker: FeeListComparePicker<string> = (fee) =>
  fee.userId;
