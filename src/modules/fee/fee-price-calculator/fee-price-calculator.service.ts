import { Injectable } from '@nestjs/common';

import { FeeDto } from '../dto/fee/fee.dto';

import {
  percentToDecimal,
  RoundedNumber,
} from '$modules/price-calculator/utils';

const CURRENCY_PRECISION = 2;

@Injectable()
export class FeePriceCalculatorService {
  public getFeePriceWithServiceProviderCut(fee: FeeDto): RoundedNumber {
    const one = RoundedNumber.of(1);
    const platformFeePercentage = RoundedNumber.of(fee.platformFeePercentage);

    const priceWithoutCut = this.getFeePriceWithoutServiceProviderCut(fee);

    const platformFeePercentageAsDecimal =
      platformFeePercentage.run(percentToDecimal);

    return priceWithoutCut.divide(one.subtract(platformFeePercentageAsDecimal));
  }

  public getFeePriceWithoutServiceProviderCut(fee: FeeDto): RoundedNumber {
    const unitPrice = RoundedNumber.of(fee.data.unitPrice, CURRENCY_PRECISION);
    const quantity = RoundedNumber.of(fee.data.quantity, CURRENCY_PRECISION);

    return unitPrice.multiply(quantity);
  }

  async calculateGrossFeesCost(fees: FeeDto[]): Promise<number> {
    const grossFeeCost = fees.reduce(
      (total, fee) => total.add(this.getFeePriceWithServiceProviderCut(fee)),
      new RoundedNumber(0),
    );

    return grossFeeCost.val();
  }
}
