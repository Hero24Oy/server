import { PromotionDB } from 'hero24-types';
import round from 'lodash/round';

export const percentToDecimal = (percent: number): number => percent / 100;

export const getValueBeforeVatApplied = (
  value: number,
  percents: number,
): number => value / (1 + percents / 100);

export type Discount = Pick<PromotionDB['data'], 'discount' | 'discountFormat'>;

// * Discounts are disabled for the moment, so not used
export const getDiscountValue = (
  discount: Discount | null,
  initialGrossAmount: number,
): number => {
  if (
    !discount ||
    (discount.discountFormat !== 'fixed' &&
      discount.discountFormat !== 'percentage')
  ) {
    return 0;
  }

  if (discount.discountFormat === 'fixed') {
    return discount.discount;
  }

  // * discount format is percentage here
  // eslint-disable-next-line no-magic-numbers -- 2 is number of digits after coma
  return round((initialGrossAmount * discount.discount) / 100, 2);
};

export const convertToDecimalNumber = (value: number): number => {
  // eslint-disable-next-line no-magic-numbers -- TODO check rounding, if it can be deleted and other existing util used
  return Number(Number(value).toFixed(2));
};
