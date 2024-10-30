import { ArgsType, Field } from '@nestjs/graphql';

import { OfferPurchaseInput } from './offer-purchase.input';

@ArgsType()
export class OfferPurchaseArgs {
  @Field(() => OfferPurchaseInput)
  input: OfferPurchaseInput;
}
