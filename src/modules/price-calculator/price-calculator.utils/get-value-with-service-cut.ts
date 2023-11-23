import { getValueWithVatApplied } from './get-value-with-vat-applied';

// TODO extract to config or even env
const SERVICE_PROVIDER_CUT = 24; // in percents

export const getValueWithServiceCut = (price: number): number =>
  getValueWithVatApplied(price, SERVICE_PROVIDER_CUT);
