import { registerEnumType } from '@nestjs/graphql';

export enum DiscountFormat {
  FIXED = 'fixed',
  fixed = 'fixed',

  // TODO remove this when migration on IWEB is done
  PERCENTAGE = 'percentage',
  percentage = 'percentage',
}

registerEnumType(DiscountFormat, {
  name: 'DiscountFormat',
});
