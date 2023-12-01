import { RoundedNumber } from './calculations/price-calculator.monad';

const DIGITS_AFTER_COMMA = 2;

export const percentToDecimal = (percent: number): number => percent / 100;

export const convertToDecimalNumber = (value: number): number =>
  new RoundedNumber(value, DIGITS_AFTER_COMMA).val();

export const getValueBeforeVatApplied = (
  value: number,
  percents: number,
): number => value / (1 + percents / 100);
