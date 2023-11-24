import { Args, Query, Resolver } from '@nestjs/graphql';

import { InvoiceDto } from './dto';
import { PriceCalculatorService } from './price-calculator.service';

@Resolver()
export class PriceCalculatorResolver {
  constructor(
    private readonly priceCalculatorService: PriceCalculatorService,
  ) {}

  @Query(() => InvoiceDto)
  computePurchaseOfferById(@Args('offerId') offerId: string) {
    return this.priceCalculatorService.computePurchaseOfferById(offerId);
  }
}
