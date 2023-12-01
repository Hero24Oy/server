import { PromotionDB } from 'hero24-types';

import { convertToDecimalNumber } from './percents';

import { FeeDto } from '$modules/fee/dto/fee/fee.dto';

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
  return convertToDecimalNumber((initialGrossAmount * discount.discount) / 100);
};

export const getFeeTotalWithoutHero24Cut = (fee: FeeDto): number => {
  const feeCost = fee.data.quantity * fee.data.unitPrice;

  return feeCost;
};
