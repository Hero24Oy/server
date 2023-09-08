import { ArgsType, Field } from '@nestjs/graphql';

import { OfferRequestUpdatedInput } from './offer-request-updated.input';

@ArgsType()
export class OfferRequestUpdatedSubscriptionArgs {
  @Field(() => OfferRequestUpdatedInput)
  input: OfferRequestUpdatedInput;
}
