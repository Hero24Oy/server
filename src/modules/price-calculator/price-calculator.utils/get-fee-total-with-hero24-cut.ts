import { convertToDecimalNumber } from './convert-decimal-to-number';

import { FeeDto } from '$modules/fee/dto/fee/fee.dto';

export const getFeeTotalWithHero24Cut = (fee: FeeDto): number => {
  const materialCost = fee.data.quantity * getFeeUnitPriceWithHero24Cut(fee);

  return materialCost;
};

export const getFeeUnitPriceWithHero24Cut = (fee: FeeDto): number => {
  // eslint-disable-next-line no-magic-numbers -- 100 is percents
  const platformFeePercentageAsDecimal = fee.platformFeePercentage / 100;

  return convertToDecimalNumber(
    fee.data.unitPrice / (1 - platformFeePercentageAsDecimal),
  );
};
