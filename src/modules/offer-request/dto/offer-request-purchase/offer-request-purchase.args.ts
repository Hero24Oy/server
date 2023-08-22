import { ArgsType, Field } from '@nestjs/graphql';
import { OfferRequestPurchaseInput } from './offer-request-purchase.input';

@ArgsType()
export class OfferRequestPurchaseArgs {
  @Field(() => OfferRequestPurchaseInput)
  input: OfferRequestPurchaseInput;
}
