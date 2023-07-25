import { Injectable } from '@nestjs/common';
import { FeeDto } from '../dto/fee/fee.dto';
import { RoundedNumber } from 'src/modules/price-calculator/price-calculator.monad';
import { percentToDecimal } from 'src/modules/price-calculator/price-calculator.utils';

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
}
