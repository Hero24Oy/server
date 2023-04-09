import { ArgsType, Field, Int } from '@nestjs/graphql';
import { OfferRequestDataInput } from './offer-request-data.input';
import { OfferRequestSubscriptionInput } from './offer-request-subscription.input';

@ArgsType()
export class OfferRequestCreationArgs {
  @Field(() => OfferRequestDataInput)
  data: OfferRequestDataInput;

  @Field(() => OfferRequestSubscriptionInput, { nullable: true })
  subscription?: OfferRequestSubscriptionInput;

  @Field(() => Int, { nullable: true })
  customerVat?: number;

  @Field(() => Int, { nullable: true })
  minimumDuration?: number;

  @Field(() => Int, { nullable: true })
  serviceProviderVAT?: number;
}
