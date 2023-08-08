import { FeeListComparePicker } from '../fee.types';

export const offerRequestIdComparePicker: FeeListComparePicker<string> = (
  fee,
) => fee.offerRequestId ?? '';
