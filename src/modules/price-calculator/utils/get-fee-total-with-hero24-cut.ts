import { convertToDecimalNumber } from './numbers';

import { FeeDto } from '$modules/fee/dto/fee/fee.dto';

const getFeeUnitPriceWithHero24Cut = (fee: FeeDto): number => {
  const platformFeePercentageAsDecimal = fee.platformFeePercentage / 100;

  return convertToDecimalNumber(
    fee.data.unitPrice / (1 - platformFeePercentageAsDecimal),
  );
};

export const getFeeTotalWithHero24Cut = (fee: FeeDto): number => {
  const materialCost = fee.data.quantity * getFeeUnitPriceWithHero24Cut(fee);

  return materialCost;
};
