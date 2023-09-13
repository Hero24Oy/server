import { registerEnumType } from '@nestjs/graphql';
import { PromotionDB } from 'hero24-types';

export enum DiscountFormat {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
}

registerEnumType(DiscountFormat, {
  name: 'DiscountFormat',
});

export const firebaseToGraphqlDiscountFormat = (
  format: PromotionDB['data']['discountFormat'],
): DiscountFormat => {
  const status = DiscountFormat[format.toUpperCase()];

  if (!status) {
    throw new Error(`Unknown discount format: ${format}`);
  }

  return status;
};
