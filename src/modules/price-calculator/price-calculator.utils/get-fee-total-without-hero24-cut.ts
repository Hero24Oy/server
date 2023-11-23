import { FeeDto } from '$modules/fee/dto/fee/fee.dto';

export const getFeeTotalWithoutHero24Cut = (fee: FeeDto): number => {
  const materialCost = fee.data.quantity * fee.data.unitPrice;

  return materialCost;
};
