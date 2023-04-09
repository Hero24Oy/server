import { Field, InputType } from '@nestjs/graphql';
import { OfferRequestDataInitialInput } from './offer-request-data-initial.input';
import { OfferRequestDataPickServiceProviderInput } from './offer-request-data-pick-service-provider.input';

@InputType()
export class OfferRequestDataInput {
  @Field(() => OfferRequestDataInitialInput)
  initial: OfferRequestDataInitialInput;

  @Field(() => OfferRequestDataPickServiceProviderInput)
  pickServiceProvider: OfferRequestDataPickServiceProviderInput;
}
