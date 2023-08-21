import { FeeStatus } from '../dto/fee/fee-status.enum';
import { FeeListComparePicker } from '../fee.types';

export const statusComparePicker: FeeListComparePicker<FeeStatus> = (fee) =>
  fee.status;
