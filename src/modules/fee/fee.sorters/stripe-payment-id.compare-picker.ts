import { FeeListComparePicker } from '../fee.types';

export const stripePaymentIdComparePicker: FeeListComparePicker<string> = (
  fee,
) => fee.stripePaymentIntentId ?? '';
