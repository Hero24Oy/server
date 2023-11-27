import { PromotionDB } from 'hero24-types';
import round from 'lodash/round';

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
  // eslint-disable-next-line no-magic-numbers -- In order to get percentage we divide by 100
  return round((initialGrossAmount * discount.discount) / 100, 2);
};
