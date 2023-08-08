import { FeeListComparePicker } from '../fee.types';

export const serviceProviderVATComparePicker: FeeListComparePicker<number> = (
  fee,
) => fee.serviceProviderVAT;
